-- Lua API reference: http://www.arpalert.org/src/haproxy-lua-api/1.7/index.html

-- The following outlines the socket address to which we need to connect.
-- it should match the unix socket that you defined in your haproxy.cfg
local socket_address = "/var/run/haproxy.sock"

function run_command(command)
	s = core.tcp()
	s:connect("unix@" .. socket_address)
	s:send(command .. "\n")
	results = s:receive("*a")
	s:close()
	return results
end

function get_metadata(applet)
	-- This is a place to include optional metadata about your
	-- particular instance of HAProxy. Here's the format that 
	-- should be used: <key_name><space><content>
	-- HOSTNAME foo.example.com
	-- This is useful in the case of adding metadata to the UI.
	return "HOSTNAME ..."
end

function instance_manager(applet)
	applet:add_header("Access-Control-Allow-Origin", "*")

	if applet.method == "POST" and applet.length > 0 and applet.path == "/manage" then
		local command = applet:receive()
		local results = run_command(command)
		if results == nil then
			applet:set_status(404)
			applet:start_response()
			applet:send("No results found.")
		else
			applet:set_status(200)
			applet:add_header("Content-Length", string.len(results))
			applet:add_header("Content-Type", "text/plain")
			applet:start_response()
			applet:send(results)
		end
	elseif applet.method == "GET" and applet.path == "/metadata" then
		applet:set_status(200)
		results = get_metadata(applet)
		applet:add_header("Content-Length", string.len(results))
		applet:start_response()
		applet:send(results)
	else
		applet:set_status(404)
		applet:start_response()
		applet:send("Please send an HAProxy command as the body of a POST request to /manage, or a GET request to /metadata")
	end
end

core.register_service("instance_manager", "http", instance_manager)