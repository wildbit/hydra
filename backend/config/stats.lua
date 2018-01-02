stats = {}

--
-- Configuration
--
--
stats.conf = {}     -- Lists all known haproxy, the index is the friendly
                    -- name of the instance.

--
-- internal shared vars
---
stats.agg = {}      -- contains the aggregated data
stats.servers = {}  -- List of the last data retrieved by server
stats.lookup = {}   -- contains a lookup for used keys.

--[[

HAProxy stats compatibility array. Alle the metrics are not
used with all the parts (backend, frontend, servers or 
listener. This array permit to give a useless element,
and gives an aggregation method.

	1 : type 0: frontend
	2 : type 1: backend
	3 : type 2: server
	4 : type 3: listener

	5 : type of data:
       "string"  : string.
       "gauge"   : integer, value.
       "counter" : integer, alway monotonic, increse with the time spent.
       "time"    : integer, time ellapsed.

	6 : aggregation type:
       "first" : keep the first value
       "add"   : add all values 
       "cat"   : catenate the values, separed by a "/"
       "avg"   : perform the average of the values

]]--
stats.values = {
	--                     1    2    3    4    5          6
	["pxname"]        = { "1", "1", "1", "1", "string",  "first"},
	["svname"]        = { "1", "1", "1", "1", "string",  "first"},
	["qcur"]          = { " ", "1", "1", " ", "gauge",   "add"  },
	["qmax"]          = { " ", "1", "1", " ", "gauge",   "add"  },
	["scur"]          = { "1", "1", "1", "1", "gauge",   "add"  },
	["smax"]          = { "1", "1", "1", "1", "gauge",   "add"  },
	["slim"]          = { "1", "1", "1", "1", "gauge",   "add"  },
	["stot"]          = { "1", "1", "1", "1", "counter", "add"  },
	["bin"]           = { "1", "1", "1", "1", "counter", "add"  },
	["bout"]          = { "1", "1", "1", "1", "counter", "add"  },
	["dreq"]          = { "1", "1", " ", "1", "counter", "add"  },
	["dresp"]         = { "1", "1", "1", "1", "counter", "add"  },
	["ereq"]          = { "1", " ", " ", "1", "counter", "add"  },
	["econ"]          = { " ", "1", "1", " ", "counter", "add"  },
	["eresp"]         = { " ", "1", "1", " ", "counter", "add"  },
	["wretr"]         = { " ", "1", "1", " ", "counter", "add"  },
	["wredis"]        = { " ", "1", "1", " ", "counter", "add"  },
	["status"]        = { "1", "1", "1", "1", "string",  "cat"  },
	["weight"]        = { " ", "1", "1", " ", "gauge",   "add"  }, -- maybe more complex
	["act"]           = { " ", "1", "1", " ", "gauge",   "add"  },
	["bck"]           = { " ", "1", "1", " ", "gauge",   "add"  },
	["chkfail"]       = { " ", " ", "1", " ", "counter", "add"  },
	["chkdown"]       = { " ", "1", "1", " ", "counter", "add"  },
	["lastchg"]       = { " ", "1", "1", " ", "time",    "avg"  },
	["downtime"]      = { " ", "1", "1", " ", "time",    "avg"  },
	["qlimit"]        = { " ", " ", "1", " ", "gauge",   "add"  },
	["pid"]           = { "1", "1", "1", "1", "gauge",   "cat"  },
	["iid"]           = { "1", "1", "1", "1", "gauge",   "cat"  },
	["sid"]           = { " ", " ", "1", "1", "gauge",   "cat"  },
	["throttle"]      = { " ", " ", "1", " ", "gauge",   "avg"  },
	["lbtot"]         = { " ", "1", "1", " ", "counter", "add"  },
	["tracked"]       = { " ", " ", "1", " ", "counter", "add"  },
	["type"]          = { "1", "1", "1", "1", "gauge",   "first"},
	["rate"]          = { "1", "1", "1", " ", "gauge",   "add"  },
	["rate_lim"]      = { "1", " ", " ", " ", "gauge",   "add"  },
	["rate_max"]      = { "1", "1", "1", " ", "gauge",   "add"  },
	["check_status"]  = { " ", " ", "1", " ", "string",  "cat"  },
	["check_code"]    = { " ", " ", "1", " ", "string",  "cat"  },
	["check_duration"]= { " ", " ", "1", " ", "time",    "cat"  },
	["hrsp_1xx"]      = { "1", "1", "1", " ", "counter", "add"  },
	["hrsp_2xx"]      = { "1", "1", "1", " ", "counter", "add"  },
	["hrsp_3xx"]      = { "1", "1", "1", " ", "counter", "add"  },
	["hrsp_4xx"]      = { "1", "1", "1", " ", "counter", "add"  },
	["hrsp_5xx"]      = { "1", "1", "1", " ", "counter", "add"  },
	["hrsp_other"]    = { "1", "1", "1", " ", "counter", "add"  },
	["hanafail"]      = { " ", " ", "1", " ", "string",  "cat"  },
	["req_rate"]      = { "1", " ", " ", " ", "gauge",   "add"  },
	["req_rate_max"]  = { "1", " ", " ", " ", "gauge",   "add"  },
	["req_tot"]       = { "1", " ", " ", " ", "counter", "add"  },
	["cli_abrt"]      = { " ", "1", "1", " ", "counter", "add"  },
	["srv_abrt"]      = { " ", "1", "1", " ", "counter", "add"  },
	["comp_in"]       = { "1", "1", " ", " ", "counter", "add"  },
	["comp_out"]      = { "1", "1", " ", " ", "counter", "add"  },
	["comp_byp"]      = { "1", "1", " ", " ", "counter", "add"  },
	["comp_rsp"]      = { "1", "1", " ", " ", "counter", "add"  },
	["lastsess"]      = { " ", "1", "1", " ", "time",    "avg"  },
	["last_chk"]      = { " ", " ", "1", " ", "string",  "cat"  },
	["last_agt"]      = { " ", " ", "1", " ", "string",  "cat"  },
	["qtime"]         = { " ", "1", "1", " ", "gauge",   "avg"  },
	["ctime"]         = { " ", "1", "1", " ", "gauge",   "avg"  },
	["rtime"]         = { " ", "1", "1", " ", "gauge",   "avg"  },
	["ttime"]         = { " ", "1", "1", " ", "gauge",   "avg"  },

	["agg"]           = { "1", "1", "1", "1", "string",  "cat"  },
}

-- csv header order
stats.csv = {
	"pxname", "svname", "qcur", "qmax", "scur", "smax",
	"slim", "stot", "bin", "bout", "dreq", "dresp",
	"ereq", "econ", "eresp", "wretr", "wredis", "status",
	"weight", "act", "bck", "chkfail", "chkdown", "lastchg",
	"downtime", "qlimit", "pid", "iid", "sid", "throttle",
	"lbtot", "tracked", "type", "rate", "rate_lim", "rate_max",
	"check_status", "check_code", "check_duration", "hrsp_1xx", "hrsp_2xx", "hrsp_3xx",
	"hrsp_4xx", "hrsp_5xx", "hrsp_other", "hanafail", "req_rate", "req_rate_max",
	"req_tot", "cli_abrt", "srv_abrt", "comp_in", "comp_out", "comp_byp",
	"comp_rsp", "lastsess", "last_chk", "last_agt", "qtime", "ctime",
	"rtime", "ttime", "agg"
}

--
-- Code extracted from http://lua-users.org/wiki/BaseSixtyFour
--
-- character table string
local b='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

-- encoding
function b64enc(data)
	return ((data:gsub('.', function(x)
		local r,b='',x:byte()
		for i=8,1,-1 do r=r..(b%2^i-b%2^(i-1)>0 and '1' or '0') end
		return r;
	end)..'0000'):gsub('%d%d%d?%d?%d?%d?', function(x)
		if (#x < 6) then return '' end
		local c=0
		for i=1,6 do c=c+(x:sub(i,i)=='1' and 2^(6-i) or 0) end
		return b:sub(c+1,c+1)
	end)..({ '', '==', '=' })[#data%3+1])
end


--[[

get_stats(uri, mode)

uri is the location of the required resources. It understand the following
forms:

 * http://[user:password@]<ip>[:<port>]/<path>
 * socket://<path>

This function returns a hash table with the frontends ans backend
hierarchically sorted. In error case, send an error using the"error"
function and doesn't returns.

]]--
stats.get_stats = function(uri)
	local pathpos
	local path
	local creds = ""
	local addr
	local msg
	local s
	local csv = {}
	local line = {}
	local pos1
	local pos2
	local typeidx
	local typepx
	local res
	local i
	local t

	-- uri must start with http:// or socket://
	if string.sub(uri, 1, 7) == "http://" then
		mode = 1
		addr = string.sub(uri, 8)
	elseif string.sub(uri, 1, 9) == "socket://" then 
		mode = 2
		addr = string.sub(uri, 10)
	else
		error("'uri' must starts with 'http://', we found '" ..
		      tostring(string.sub(uri, 1, 7)) .. "'")
	end

	--
	-- mode 1: sends http request
	--
	if mode == 1 then

		-- separates ip:port from the path
		local pathpos = string.find(addr, "/")
		if (pathpos == nil) then
			path = "/"
		else
			path = string.sub(addr, pathpos)
		end
		addr = string.sub(addr, 1, pathpos - 1)

		-- extract login / password
		local sep = string.find(addr, "@")
		if sep ~= nil then
			creds = string.sub(addr, 1, sep - 1)
			addr = string.sub(addr, sep + 1, -1)

			-- build header
			creds = "Authorization: Basic " .. b64enc(creds) .. "\r\n"
		end

		-- send request
		s = core.tcp()
		s:connect(addr)
		s:send("GET " .. path .. " HTTP/1.0\r\nHost: " .. addr .. "\r\n" .. creds .. "\r\n");

		-- read response, remove headers
		while true do
			msg = s:receive("*l")
			if msg == nil then
				s:close()
				return nil
			end
			msg = string.gsub(msg, "\r", "")
			msg = string.gsub(msg, "\n", "")
			if msg == "" then break end
		end
		if string.len(msg) == 0 then
			s:close()
			return nil
		end

		-- read CSV
		msg = s:receive("*a")
		if msg == nil then
			s:close()
			return nil
		end
	
		-- close conection
		s:close()

	--
	-- mode 2: sens stats request
	--
	elseif mode == 2 then

		-- send request
		s = core.tcp()
		s:connect("unix@" .. addr)
		s:send("show stat -1 15 -1\n");

		-- read CSV
		msg = s:receive("*a")
		if msg == nil then
			s:close()
			return nil
		end

		-- close conection
		s:close()
	end

	-- removes \r
	msg = string.gsub(msg, "\r", "")

	while true do

		-- read first value. expects
		if string.sub(msg, 1, 1) == '"' then
			-- read a simple value terminated by '"', escapes the '""'.
		else
			-- read a simple value terminated by "," or "\n"
			pos1 = string.find(msg, ",")
			pos2 = string.find(msg, "\n")
			if pos1 == nil then pos1 = string.len(msg) end
			if pos2 == nil then pos2 = string.len(msg) end
			if pos2 < pos1 then pos1 = pos2 end
			table.insert(line, string.sub(msg, 1, pos1 - 1))

			-- if the separator is a newline
			if string.sub(msg, pos1, pos1) == "\n" then
				table.insert(csv, line)
				line = {}
			end

			msg = string.sub(msg, pos1 + 1) -- eat the cell
		end
	
		-- reak process if the csv message is empty
		if msg == "" then break end
	end

	-- transform value array to object array
	local hdr = {}
	local obj = {}
	for i, t in pairs(csv) do

		if type(t[1]) == "string" and t[1] == "# pxname" then
			t[1] = "pxname"
			hdr = t
			-- look for the type idx
			for i,v in pairs(hdr) do
				if v == "type" then
					typeidx = i
					break
				end
			end
		else
			-- create new array that is a mix between
			-- column name and values. Clean the useless
			-- values.
			local h = {}
			if t[typeidx] ~= nil then
				typepx = tonumber(t[typeidx]) + 1
				for i,v in pairs(t) do
					if hdr[i] ~= "" then
						if stats.values[hdr[i]] ~= nil then
							if stats.values[hdr[i]][typepx] == "1" then
								if stats.values[hdr[i]][5] == "gauge" or
								   stats.values[hdr[i]][5] == "counter" or
								   stats.values[hdr[i]][5] == "time" then
									h[hdr[i]] = tonumber(v)
								else
									h[hdr[i]] = v
								end
							end
						end
					end
				end
			end
			table.insert(obj, h)
		end
	end
	
	-- define the array object
	res = {}
	res['frontends'] = {}
	res['backends'] = {}

	-- process all the frontends
	for i, t in pairs(obj) do
		if t["type"] == 0 then -- frontend
			res['frontends'][t["pxname"]] = t
			res['frontends'][t["pxname"]]["listeners"] = {}
		elseif t["type"] == 1 then -- backend
			res['backends'][t["pxname"]] = t
			res['backends'][t["pxname"]]["servers"] = {}
		end
	end

	-- process all the backends
	for i, t in pairs(obj) do
		if t["type"] == 2 then -- server
			res['backends'][t["pxname"]]["servers"][t["svname"]] = t
		elseif t["type"] == 3 then -- listener
			res['frontends'][t["pxname"]]["listeners"][t["svname"]] = t
		end
	end

	return res
end

stats.merge_agg = function(stats, mode)
	local k
	local v
	local res
	local c

	--
	-- first
	--
	if mode[6] == "first" then
		for k, v in pairs(stats) do
			res = stats[k]
			break
		end

	--
	-- add
	--
	elseif mode[6] == "add" then
		res = 0
		for k, v in pairs(stats) do
			res = res + stats[k]
		end

	--
	-- catenate
	--
	elseif mode[6] == "cat" then
		res = ""
		for k, v in pairs(stats) do
			if res == "" then
				res = tostring(stats[k])
			else
				res = res .. "/" .. tostring(stats[k])
			end
		end
	
	--
	-- average
	--
	elseif mode[6] == "avg" then
		res = 0
		c = 0
		for k, v in pairs(stats) do
			res = res + stats[k]
			c = c + 1
		end
		if c > 0 then
			res = res / c
		end
	end

	return res;
end

stats.merge_stats = function(stats_array)
	local res;
	local list;
	local k
	local v
	local val
	local srv
	local frt
	local bck
	local lis
	local stat

	-- destination struct
	res = {}
	res['frontends'] = {}
	res['backends'] = {}

	-- fill the destination
	for srv, stat in pairs(stats_array) do
		if stat['frontends'] ~= nil then
			for frt, val in pairs(stat['frontends']) do
				if res['frontends'][frt] == nil then
					res['frontends'][frt] = {}
					res['frontends'][frt]['listeners'] = {}
				end
				if stat['frontends'][frt]['listeners'] ~= nil then
					for lis, val in pairs(stat['frontends'][frt]['listeners']) do
						if res['frontends'][frt] == nil then
							res['frontends'][frt] = {}
						end
						if res['frontends'][frt]['listeners'] == nil then
							res['frontends'][frt]['listeners'] = {}
						end
						if res['frontends'][frt]['listeners'][lis] == nil then
							res['frontends'][frt]['listeners'][lis] = {}
						end
					end
				end
			end
		end
		if stat['backends'] ~= nil then
			for frt, val in pairs(stat['backends']) do
				if res['backends'][frt] == nil then
					res['backends'][frt] = {}
					res['backends'][frt]['servers'] = {}
				end
				if stat['backends'][frt]['servers'] ~= nil then
					for srv, val in pairs(stat['backends'][frt]['servers']) do
						if res['backends'][frt] == nil then
							res['backends'][frt] = {}
						end
						if res['backends'][frt]['servers'] == nil then
							res['backends'][frt]['servers'] = {}
						end
						if res['backends'][frt]['servers'][srv] == nil then
							res['backends'][frt]['servers'][srv] = {}
						end
					end
				end
			end
		end
	end

	-- data aggregation

	--
	-- frontends
	--
	for frt, val in pairs(res['frontends']) do

		for prop, mode in pairs(stats.values) do
			if mode[1] == "1" then
				-- build list of frontends
				list = {}
				for k, v in pairs(stats_array) do
					if stats_array[k]['frontends'] and
					   stats_array[k]['frontends'][frt] and
					   stats_array[k]['frontends'][frt][prop] then
						list[k] = stats_array[k]['frontends'][frt][prop]
					end
				end
				-- aggregation values
				res['frontends'][frt][prop] = stats.merge_agg(list, mode)
			end
		end
		list = ""
		for k, v in pairs(stats_array) do
			if stats_array[k]['frontends'][frt] ~= nil then
				if list == "" then
					list = k
				else
					list = list .. "/" .. k
				end
			end
		end
		res['frontends'][frt]["agg"] = list

		--
		-- listeners
		--
		for lis, val in pairs(res['frontends'][frt]['listeners']) do

			for prop, mode in pairs(stats.values) do
				if mode[4] == "1" then
					-- build list of frontends
					list = {}
					for k, v in pairs(stats_array) do
						if v['frontends'][frt] and
						   v['frontends'][frt]['listeners'] and
						   v['frontends'][frt]['listeners'][lis] and
						   v['frontends'][frt]['listeners'][lis][prop] then
							list[k] = v['frontends'][frt]['listeners'][lis][prop]
						end
					end
					-- aggregation values
					res['frontends'][frt]['listeners'][lis][prop] = stats.merge_agg(list, mode)
				end
			end

			list = ""
			for k, v in pairs(stats_array) do
				if stats_array[k]['frontends'][frt] and
				   stats_array[k]['frontends'][frt]['listeners'] and
				   stats_array[k]['frontends'][frt]['listeners'][lis] then
					if list == "" then
						list = k
					else
						list = list .. "/" .. k
					end
				end
			end
			res['frontends'][frt]['listeners'][lis]["agg"] = list

		end
	end

	--
	-- backends
	--
	for bck, val in pairs(res['backends']) do

		for prop, mode in pairs(stats.values) do
			if mode[2] == "1" then
				-- build list of frontends
				list = {}
				for k, v in pairs(stats_array) do
					if stats_array[k]['backends'] and
					   stats_array[k]['backends'][bck] and
					   stats_array[k]['backends'][bck][prop] then
						list[k] = stats_array[k]['backends'][bck][prop]
					end
				end
				-- aggregation values
				res['backends'][bck][prop] = stats.merge_agg(list, mode)
			end
		end
		list = ""
		for k, v in pairs(stats_array) do
			if stats_array[k]['backends'][bck] ~= nil then
				if list == "" then
					list = k
				else
					list = list .. "/" .. k
				end
			end
		end
		res['backends'][bck]["agg"] = list

		--
		-- servers
		--
		for srv, val in pairs(res['backends'][bck]['servers']) do

			for prop, mode in pairs(stats.values) do
				if mode[3] == "1" then
					-- build list of frontends
					list = {}
					for k, v in pairs(stats_array) do
						if v['backends'][bck] and
						   v['backends'][bck]['servers'] and
						   v['backends'][bck]['servers'][srv] and
						   v['backends'][bck]['servers'][srv][prop] then
							list[k] = v['backends'][bck]['servers'][srv][prop]
						end
					end
					-- aggregation values
					res['backends'][bck]['servers'][srv][prop] = stats.merge_agg(list, mode)
				end
			end

			list = ""
			for k, v in pairs(stats_array) do
				if stats_array[k]['backends'][bck]['servers'][srv] ~= nil then
					if list == "" then
						list = k
					else
						list = list .. "/" .. k
					end
				end
			end
			res['backends'][bck]['servers'][srv]["agg"] = list

		end
	end

	return res
end

stats.tocsv = function(msg)
	if msg == nil then return "" end
	return tostring(msg)
end

-- This function is an applet thats accept and HTTP request
-- and return a aggregated CSV
stats.csv_service = function(applet)
	local frt
	local bck
	local srv
	local lis
	local val1
	local val2
	local k
	local i
	local msg
	
	msg = "# "

	for i, k in ipairs(stats.csv) do
		msg = msg .. k .. ","
	end
	msg = msg .. "\n"

	for frt, val1 in pairs(stats.agg['frontends']) do
		for i, k in ipairs(stats.csv) do
			msg = msg .. stats.tocsv(val1[k]) .. ","
		end
		msg = msg .. "\n"
		for lis, val2 in pairs(val1['listeners']) do
			for i, k in ipairs(stats.csv) do
				msg = msg .. stats.tocsv(val2[k]) .. ","
			end
			msg = msg .. "\n"
		end
	end

	for bck, val1 in pairs(stats.agg['backends']) do
		for i, k in ipairs(stats.csv) do
			msg = msg .. stats.tocsv(val1[k]) .. ","
		end
		msg = msg .. "\n"
		for srv, val2 in pairs(val1['servers']) do
			for i, k in ipairs(stats.csv) do
				msg = msg .. stats.tocsv(val2[k]) .. ","
			end
			msg = msg .. "\n"
		end
	end

	applet:add_header("content-length", tostring(msg:len()));
	applet:set_status(200)
	applet:start_response()
	applet:send(msg)
end

-- The following function gets and merge all the known haproxy
-- stats each second.
stats.update = function()
	local k
	local v
	local vals
	local srv = {}
	while true do
		for k, v in pairs(stats.conf) do
			vals = stats.get_stats(v)
			if vals ~= nil then srv[k] = vals end
		end
		local g = stats.merge_stats(srv)
		stats.servers = srv;
		stats.agg = g 
		core.sleep(1)
	end
end

-- register general fetches to get the merged values
-- syntax is:
--
--    ["f" | "b"] ":" <fe/be name> ":" <metrix>
--    ["f" | "b"] ":" <fe/be name> ":" [ <server> | <listener> ] ":" <metrix>
--
-- example:
--
--   f:bck_webfarm:qcur
--   f:bck_webfarm:server1:qcur
--
stats.process_key = function(key)
	local path = {}
	local p = key
	local pos
	local febe = 0

	if stats.lookup[key] ~= nil then
		return stats.lookup[key]
	end

	-- must start with "f:" or "b:"
	if p:sub(1, 2) == "f:" then
		table.insert(path, "frontends")
		febe = 0
	elseif  p:sub(1, 2) == "b:" then
		table.insert(path, "backends")
		febe = 1
	else
		error("the agg key '" .. key .. "' is invalid")
	end
	p = p:sub(3)
	
	-- look for the next part, search a mandatory ":"
	pos = p:find(":")
	if pos == nil then
		error("the agg key '" .. key .. "' is invalid")
	end
	table.insert(path, p:sub(1, pos - 1))
	p = p:sub(pos + 1)

	-- look for the next part, search for a ":" or the end.
	pos = p:find(":")
	if pos == nil then
		table.insert(path, p)
		stats.lookup[key] = path
		return path
	end
	if febe == 0 then
		table.insert(path, "listeners")
	else
		table.insert(path, "servers")
	end
	table.insert(path, p:sub(1, pos - 1))
	p = p:sub(pos + 1)

	-- stores the last part
	table.insert(path, p:sub(1, -1))

	-- index and return the result
	stats.lookup[key] = path
	return path
end

stats.fetch = function(txn, name)
	local w
	local path
	local i
	local v
	local tab

	-- perform a lookup
	path = stats.process_key(name)
	tab = stats.agg
	for i, v in pairs(path) do
		if tab[v] == nil then
			error("key '" .. name .. "' doesn't exists (or not yet exists)")
		end
		tab = tab[v]
	end

	return tab
end

--	["h1"] = "http://127.0.0.1:10002/;csv",
--	["h2"] = "socket:///tmp/haproxy",
stats.add = function(name, uri)
	stats.conf[name] = uri
end

core.register_service("stats", "http", stats.csv_service)
core.register_fetches("stats", stats.fetch)
core.register_task(stats.update)

stats.add("local", "socket:///var/run/haproxy.sock")