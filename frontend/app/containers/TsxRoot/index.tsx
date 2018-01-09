import * as React from 'react';
import Store from '../../models/Store'
import { HAProxyInstance } from '../../models/HAProxy';
import { ICollection } from '../../models/Helpers';

export default class TsxRoot extends
    React.Component<any, ICollection<HAProxyInstance>>  {
    
    private listener;

    constructor(props: any) {
        super(props, null);
        this.state = { elements: [] };
    }

    componentDidMount() {
        Store.instance.RegisterListener(this, elements => this.setState({ elements }));
    }

    componentWillUnmount() {
        Store.instance.UnregisterListener(this);
    }

    render() {return (<table>
                <thead>
                    <tr><th>HAProxy Instance Count: {this.state.elements.length}</th></tr>
                </thead>
                <tbody>
                    {this.state.elements.map(f => <tr><td>{f.display_name}</td></tr>)}
                </tbody>
            </table>);
    }
}
