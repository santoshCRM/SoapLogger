# SoapLogger
Dynamics CRM or now Dynamics 365 provide out of box way to execute our workflows.
We can execute on demand workflows from CRM for multiple and single record on click of Run Workflow.
In Dynamics CRM 2013 onwords CRM has launched a new process know as Action.
We can create Action and call them from javascript or plugin.
In Dynamics 365 we can call Action in workflow also.
But their is limitation in Dynamics 365 that we cannot run Action on single click as we can do for workflow on single click.
To resolve that I have created a plugin for XRMTOOLBOX, with the help of this Plugin you can execute Action for any entity.
It will show list of all Action based on selected entity.
It will get one record as default on action selection, but user can change this record id based on their requirement.
On click on Run button it will excute that Action and return you request and response string in first textbox.
On click of >> button it will convert that output string in format that can be used in javascript or C# directly.
Their are two button in bottom to copy that string to clipboard. 

Happy Dynamic!!
