import { serverConfig } from "../../server";

// Store list of Policies and procedures with service request forms.
const policiesProcedures = {"Acceptance & Commissioning Procedure": `https://${serverConfig.host}:${serverConfig.port}/administration/policies-procedures/Acceptance and Commissioning.pdf`,
                            "Corrective Maintenance": `https://${serverConfig.host}:${serverConfig.port}/administration/policies-procedures/Corrective_Maintenance.pdf`};
                               
export function AdministrationDisplay({queryClient, showMessage, closeDialog}) {
    return (
        <div className="administration-display-container flex-c">
            <h1>Page Not Yet Implemented</h1>
        </div>
    )
}