import React from 'react';
import Layout from 'containers/Layout';
import * as generate from 'project-name-generator';

const About = (props) => {
  return (
    <Layout {...props} hideSidebar >
      <div className="container">
        <br />
        <h2>This is Hydra.</h2>
        <p>Hydra is a simple management console for HAProxy.</p>
        <hr />
        <h4>Conceptual Overview</h4>
        <p>
          Hydra is a static website that you can use as a central management tool for all of your HAProxy instances.
        The concept of Hydra is to <em>not</em> be another service you need to manage.
        Instead, you add a simple Lua script on each of your HAProxy instances, which allows this interface to interact with it.
        This interface is served over https, and it'll be cached by your browser so that even if you can't connect to hydra.wildbit.com,
        you can still use the interface locally to manage your HAProxy instances.
      </p>
        <h4>Installation</h4>
        <p>
          Using this interface to manage your HAProxy instances is easy:
          </p>
        <h6>Install Lua Management Script</h6>
        <p>
          Download and copy the <code><a href="../public/instance_manager.lua" target="_blank">instance_manager.lua</a></code> script in the same directory of your <code>haproxy.cfg</code> file.
          </p>
        <h6>Add a listener</h6>
        <p>
          Add a listener to the HAProxy instance you want to manage with the following config:
        </p>
        <pre>
        global<br/>
        &nbsp; lua-load instance_manager.lua<br/>
        <br/>
        cache hydra_ui_cache<br />
        &nbsp; total-max-size 30<br/>
        &nbsp; max-age 1800<br/>
        <br/>
        userlist hydra_ui_users<br/>
        &nbsp; user admin insecure-password {generate({number: true, words: 3}).dashed}<br/>
        <br/>
        listen hydra_ui<br/>
        &nbsp; mode http<br/>
        &nbsp; bind 127.0.0.1:9005<br/>
        &nbsp; acl authenticated http_auth(hydra_ui_users)<br/>
        &nbsp; acl lua_handling path_beg /api<br/>
        &nbsp; http-request deny unless lua_handling authenticated || lua_handling METH_OPTIONS || !lua_handling<br/>
        &nbsp; http-request use-service lua.instance_manager if lua_handling<br />
        <br/>  
        &nbsp; # The following config is optional, but will make this interface available<br/>
        &nbsp; # by navigating to http://localhost:9005 on your HAProxy instance.<br/>
        &nbsp; http-request cache-use hydra_ui_cache<br />
        &nbsp; http-request set-header Host hydra.wildbit.com<br/>
        &nbsp; server assets hydra.wildbit.com:443 check-sni str(hydra.wildbit.com) sni str(hydra.wildbit.com) ssl verify none<br/>
        </pre>
        <h6>Reload HAProxy</h6>
        <p>
          After you've set up the configuration above, you should reload HAProxy. You can confirm that everything is working by curling one of the newly added endpoints:
        </p>
        <pre><code>$ curl http://127.0.0.1:9005/api/stats</code></pre>

        <h4>Security</h4>
        <p>
          You might have noticed that the Lua script can run admin-level commands, and that we're making this available only to localhost 127.0.0.1:9005 by default.
        It is likely your organization has restrictions on who can access servers, firewall rules, and password requirements. Additionally, even with great tools like Let's Encrypt
        for issuing trusted certificates for your server's domain names, it's still not easy to automatically configure those certificates due to DNS requirements.
      </p>
        <p>Given the variability in security requirements, Hydra does not impose any restrictions on how you expose the connection to your HAProxy servers. Hydra can connect to http or https servers, using HTTP Authentication</p>
        <p>We recommend that you <em>never</em> open this management interface to the public Internet. When possible, we recommend you configure https for this service.</p>
        <p>If setting up https is not feasible, another option is to use an SSH port tunnel
          to your HAProxy server. This allows you to connect to the local port on your HAProxy
          instance. We like this method because the management interface will only be available over
          an encrypted connection, and only to users that have ssh access to the HAProxy server.</p>
        <h4>Extending, Complements, and Issues</h4>
        <p>This an Open Source project! You can modify and serve it from your own system. <a href="https://github.com/wildbit/hydra" target="_blank">Checkout our github project.</a></p>
      </div>
    </Layout>
  );
};
export default About;
