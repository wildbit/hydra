import React from 'react';
import Layout from 'components/Layout';

const About = () => {
  return (
    <Layout hideSidebar model={{}}>
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
          Download and copy the <code>instance_manager.lua</code> script in the same directory of your <code>haproxy.cfg</code> file.
          </p>
        <h6>Add a listener</h6>
        <p>
          Add a listener to the HAProxy instance you want to manage with the following config:
        </p>
        <pre><code>
            global
   lua-load instance_manager.lua
frontend stats_over_http
  mode http
  bind 127.0.0.1:9005
  http-request use-service lua.instance_manager
        </code></pre>
        <h6>Reload HAProxy</h6>
        <p>
          After you've set up the configuration above, you should reload HAProxy. You can confirm that everything is working by curling one of the newly added endpoints:
        </p>
        <pre><code>$ curl http://127.0.0.1:9005/stats</code></pre>
        
        <h4>Security</h4>
        <p>
          You might have noticed that the Lua script can run admin-level commands, and that we're making this available only to localhost 127.0.0.1:9005 by default.
        It is likely your organization has restrictions on who can access servers, firewall restrictions, and password requirements. Additionally, even with great tools like Let's Encrypt
        for issuing trusted certificates for your server's domain names, it's still not easy to automatically configure those certificates due to DNS requirements.
      </p>
        <p>Given the large variability in security requirements, Hydra does not impose any restrictions on how you expose the connection to your HAProxy servers. Hydra can connect to http or https servers, using Basic HTTP Auth.</p>
        <p>We recommend that you <em>never</em> directly open the http port to the public Internet. If you want simpler access to your servers, we configuring the listener to use https, and add an ACL to the listener that requires Basic HTTP Auth to use the listener.</p>
        <p>If setting up https and ACLs is not easy/feasible, another simple option is to add an SSH port tunnel to your HAProxy server. This allows you to connect to the local port on your HAProxy instance as though it is local. We like this method, as the listener will only be available, over an encrypted connection, to users that have ssh access to the HAProxy server.</p>
        <h4>Extending, Complements, and Issues</h4>
        <p>This an Open Source project! You can modify and serve it from your own system. <a href="https://github.com/wildbit/hydra" target="_blank">Checkout our our github project.</a></p>
      </div>
    </Layout>
  );
};
export default About;
