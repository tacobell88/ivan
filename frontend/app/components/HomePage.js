import React, { useEffect } from "react";
import Page from "./Page";

function HomePage () {
    console.log('hello homepage');
    return (
        <Page title="Home Page">
           <h1> Welcome to the Main Page </h1>
        </Page>
    )
}

export default HomePage