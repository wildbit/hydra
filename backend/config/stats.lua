function trim(s)
 return s:gsub("^%s*(.-)%s*$", "%1")
end

function run_command(socket_name, command)

	-- send request
	s = core.tcp()
	s:connect("unix@" .. trim(socket_name))
	s:send(trim(command) .. "\n")
	results = s:receive("*a")
	s:close()
	return results
end

function socket_command(applet)
	if applet.method == "POST" and applet.length > 0 then
		local command = applet:receive()
		local results = run_command("/var/run/haproxy.sock", command)
		if results == nil then
			applet:set_status(404)
			applet.start_response()
			applet.send("No results found.")
		else
			applet:set_status(200)
			applet:add_header("Content-Length", string.len(results))
			applet:add_header("Content-Type", "text/plain")
			applet:start_response()
			applet:send(results)
		end
	else
		applet:set_status(404)
		applet:start_response()
		applet:send("Please send an HAProxy command as the body of a POST request.")
	end
end

core.register_service("socket_command", "http", socket_command)

-- stats.add("local", "socket:///var/run/haproxy.sock")