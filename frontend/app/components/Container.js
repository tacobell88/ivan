import React, { useEffect } from 'react'

function Container (props) {
    return (
        <div class="container container--narrow py-md-5">
            {props.children}
        </div>
    )
}

export default Container;