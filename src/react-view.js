import ReactDOM from 'react-dom';
import React from 'react';


export default class ReactView{
    static render(component, id){
        ReactDOM.render(React.createElement(component), document.getElementById(id));
    }
}