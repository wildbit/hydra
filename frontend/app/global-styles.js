import { injectGlobal } from 'styled-components';

/* eslint no-unused-expressions: 0 */
injectGlobal`
  @import url('https://fonts.googleapis.com/css?family=Karla:400,400i,700,700i');

  html,
  body {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Karla', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  header {
    position: sticky !important;
    top: 0;
    z-index: 1050;
  }

  #app {
    background-color: #f6f7fb;
  }

  main.container {
    margin-right: 0;
    margin-left: 0;
  }

  // Switch
  .switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 25px;
    margin-bottom: 0;
  }

  .switch input {display:none;}

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 17px;
    width: 17px;
    left: 3px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
  }

  input:checked + .slider {
    background-color: #12ad65;
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #12ad65;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }

  /* Rounded sliders */
  .slider.round {
    border-radius: 34px;
  }

  .slider.round:before {
    border-radius: 45px;
  }

  footer {
    padding-top: 10px;
  }

  .app-container {
    height: 100vh;
    width: 100vw;
  }

  .instance-details {
  }
  .instance-item {
    border-left: 5px solid transparent;
    color: #333;
    padding-top: 1em;
    padding-bottom: 1em;
    border-bottom: 1px solid rgba(0,0,0,0.05);
  }
  .instance-item:hover {
    background-color: rgba(255, 255, 255, .4);
  }
  .instance-item.disabled {
    border-left-color: #007bff;
    color: #007bff;
    background-color: #FFF;
  }
  .instance-state-label {
    font-size: 15px;
    margin-left: 15px;
    vertical-align: 4px;
  }
  .instance-state {
    font-size: 14px;
    margin-right: 8px;
  }
  .instance-state-label.online,
  .instance-state.online {
    color: #4bd496;
  }
  .instance-state-label.offline,
  .instance-state.offline {
    color: #fe6e43;
  }

  .server-table {
    margin-bottom: 0;
  }
  .server-table thead th {
    border-top: none;
    color: #afb2bb;
    border-bottom: 1px solid #F1F2F6;
    text-transform: uppercase;
    font-size: 13px;
    padding: 0 1.5rem .75rem;
    font-weight: normal;
  }
  .server-table td {
    border-top-color: #F1F2F6;
    vertical-align: middle;
    padding: .75rem 1.5rem;
  }

  /* Sidebar */
  .sidebar {
    padding: 0;
    z-index: 1000;
    -webkit-box-ordinal-group: 1;
    order: 0;
    background-color: #FFF;
    box-shadow: 2px 0 12px rgba(0, 0, 0, 0.04);
    border-right: 1px solid rgba(0, 0, 0,.07);
  }

  .sidebar .instances {
    overflow-y: auto;
  }

  .sidebar .controls {
    position: sticky;
    bottom: 0;
    padding: 15px;
    border-top: 1px solid rgba(0,0,0,.05);
  }

  @media (min-width: 768px) {
    .sidebar {
      position: sticky;
      top: 3.5rem;
      height: calc(100vh - 3.5rem);
    }
    .sidebar .instances {
      height: calc(100vh - 8rem);
    }
  }

`;
