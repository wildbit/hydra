json = require "json"
-- Lua API reference: http://www.arpalert.org/src/haproxy-lua-api/1.7/index.html

function get_metadata(applet)
	-- This is a place to include optional metadata about your
	-- particular instance of HAProxy. Here's the format that 
	-- should be used: <key_name><space><content>
	-- HOSTNAME foo.example.com
	-- This is useful in the case of adding metadata to the UI.
	return "HOSTNAME ..."
end

function get_stats(applet)
	local proxies = {}
	for i, p in pairs(core.proxies) do
		local proxy = { stats = p:get_stats(), listeners = {}, servers = {} }
		for _,l in pairs(p.listeners) do
			table.insert(proxy.listeners, l:get_stats())
		end
		for _,s in pairs(p.servers) do
			table.insert(proxy.servers, s:get_stats())
		end
		table.insert(proxies, proxy)
	end
	send_response(applet, { proxies = proxies })
end

function send_response(applet, response)
	applet:set_status(200)
	local response_json = json.encode(response)
	applet:add_header('Access-Control-Allow-Origin', '*')
	applet:add_header('Content-Type', 'application/json')
	applet:add_header('Content-Length', string.len(response_json))
			applet:start_response()
	applet:send(response_json)
end

function find_server(lookup)
	for _,p in pairs(core.proxies) do
		local pxs = p:get_stats()
		if pxs.iid == lookup.iid then
			 for _, s in pairs(p.servers) do
				 if s:get_stats().sid == lookup.sid then
		 			return s
		 		end
		 	end
		end
	end
	return nil
end

function process_request(applet)
	if applet.path == '/stats' and applet.method == 'GET' then
		get_stats(applet)
	elseif applet.path == '/server/set-weight' and applet.method == 'POST' then
		local command = json.decode(applet:receive())
		local server = find_server(command)
		local result = { success = false, weight = nil } 
		if server ~= nil then
			server:set_weight(command.weight)
			result.success = true
			result.weight = server:get_weight()
		end
		send_response(applet, result)
	elseif applet.path == '/server/set-mode' and applet.method == 'POST' then
		local command = json.decode(applet:receive())
		local server = find_server(command)
		local result = { success = false }
		local mode = command.mode:lower()
		if server ~= nil then
			if mode == 'maint' then
				server:set_maint()
			elseif mode == 'drain' then
				server:set_draining()
			elseif mode == 'ready' then
				server:set_ready()
			end
			result.success = true
		end
		send_response(applet, result)
	elseif applet.method == 'OPTIONS' then
		applet:set_status(200)
		applet:add_header('Access-Control-Allow-Origin', '*')
		applet:add_header('Allow', 'OPTIONS, GET, POST')
		applet:start_response()
		applet:send('')
	elseif applet.method == 'GET' and applet.path == '/' then
		send_response(applet, { endpoints = {
			'/stats',
			'/server/set-weight',
			'/server/set-mode'
		}})
	else
		applet:set_status(404)
		applet:add_header('Access-Control-Allow-Origin', '*')
		applet:start_response()
		applet:send('Endpoint not found.')
	end
end

core.register_service("instance_manager", "http", process_request)
