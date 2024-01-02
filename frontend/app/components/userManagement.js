import React, { useEffect } from "react";
import Page from "./Page.js";
import ExampleTable from "./ExampleTable.js";
import CreateGroup from "./CreateGroup.js";
import CreateUser from "./CreateUser.js";

function UserManagement () {
    return (
        <Page title="User Management">
            <CreateGroup/>
            <CreateUser/>
            <ExampleTable />
        </Page>
    )
}

export default UserManagement