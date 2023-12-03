import { PoliciesProcedures } from "./PoliciesProcedures";
import { ModificationFabrication } from "./ModificationFabrication";
import { DisasterPlans } from "./DisasterPlans";

export function AdministrationDisplay({queryClient, showMessage, closeDialog}) {
    
    return (
        <>
            <div className="forms-templates-container flex-c-col">
                <div className="templates-section flex-c-col">
                    <div className="templates-section-title-container flex-c">
                        <h2 className="template-heading">Policies and Procedures</h2>
                    </div>
                    <PoliciesProcedures />
                </div>
            </div>
            <div className="forms-templates-container flex-c-col">
                <div className="templates-section flex-c-col">
                    <div className="templates-section-title-container flex-c">
                        <h2 className="template-heading">Modification and Fabrication</h2>
                    </div>
                    <ModificationFabrication />
                </div>
            </div>
            <div className="forms-templates-container flex-c-col">
                <div className="templates-section flex-c-col">
                    <div className="templates-section-title-container flex-c">
                        <h2 className="template-heading">Disaster Plans</h2>
                    </div>
                    <DisasterPlans />
                </div>
            </div>
        </>
    )
}