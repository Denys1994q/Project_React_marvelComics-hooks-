import React from "react";
import newHeader from './newheader.css'

const NewHeader = (props) => {

    return (
        <div>
            {
                React.Children.map(props.children, child => {
                    return React.cloneElement(child, {className: 'boo'});
                })
            }
        </div>
    )

}

export default NewHeader;