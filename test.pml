process BAU_Sprint_AsIs {

    sequence sprint_planning {
    action agree_sprint_goal {
        provides { sprint_goal }
        script { "Team agree on objectives for current sprint." }
        agent { Developer && QA && ProductOwner && ScrumMaster }
    }

    action agree_point_target {
        requires { velocity }
        provides { sprint_target }
        script { "Scrum master sets initial target based on
        velocity of last three sprints, then subtracts points if
        people will be off on holiday or working on other tasks.
        Process adjustments from retrospective will be factored in somehow."
        }
        agent { ScrumMaster && Developer && QA }
    }

    iteration create_sprint_backlog {
        action propose_issue {
        script { "Product Owner proposes dev_issue for sprint backlog." }
        requires { dev_issue.on_candidate_backlog }
        provides { dev_issue.on_candidate_backlog }
        agent { ProductOwner }
        }

        action eval_issue {
        script { "Team decides whether issue will fit into
        current sprint. 

                Scrum master guides this decision.  If
        there is a large high-priority task already on the
        backlog, lower-priorty tasks will be added to fill the backlog.

                Also, backlog should contain both large and small
        tasks so developers can see progress, and should not
        load QA at the end while leaving him idle at
        beginning." 
        }
        requires { dev_issue.on_candidate_backlog }
        provides { dev_issue.ok_to_impl || dev_issue.too_large } 
        agent { Developer && QA && ScrumMaster}
        }

        selection {
        action add_issue_to_backlog {
            script { "If issue will fit into current sprint window, PO adds issue to sprint backlog. " }
            requires { dev_issue.ok_to_impl }
            provides { dev_issue.on_sprint_backlog } 
            agent { ProductOwner }
        }
        }
    }
    }

    branch sprint_execution {
    iteration {
        action begin_change { /* Does this really happen? */
        script { "Developer chooses a ticket from the sprint backlog." }
        requires { dev_issue.on_sprint_backlog /* in sprint_backlog */ }
        provides { dev_issue.status == "started" }
        agent { Developer }
        }

        action understand_issue {
        script { "Developer investigates issue and gathers background to design implementation of change." }
        requires { dev_issue.status == "started" }
        provides { dev_issue }
        agent { Developer && (ProductOwner || QA || Architect || SrDeveloper) }
        }

        action identify_unit {
        script { "Developer identifies code unit to be modified.  May involve asking either QA or Dan." }
        requires { dev_issue}
        provides { dev_issue && unit_to_be_changed }
        agent { Developer && (Architect || SrDeveloper) }
        }

        action implement_change {
        script { "Developer modifies unit to implement change." }
        requires { dev_issue && unit_to_be_changed }
        provides { unit_to_be_changed.implemented }
        }

        action test_change {
        script { "Developer manually unit tests modified unit." }
        requires { unit_to_be_changed.implemented }
        provides { unit_to_be_changed.unit_tested }
        }

        action build_for_alternate_product {
        script { "Developer builds alternate product to ensure change works on both." }
        requires { unit_to_be_changed.unit_tested }
        provides { product_build }
        }

        action unit_test_alternate_product {
        script { "Developer manually unit tests modified unit." }
        requires { product_build }
        provides { product_build.unit_tested }
        }

        action commit_change {
        script { "Developer commits change to trunk." }
        requires { dev_issue && product_build.unit_tested }
        provides { dev_issue.status == "ready_for_QA" }
        }
    }

    iteration test_changes {
        action request_build { 
        script { "QA lead requests new build.  Normally this
        would be for each change, but if the changes are
        small/cosmetic they can accumulate so the build effort is
        less than the QA effort." }
        requires { dev_issue.status == "ready_for_QA" }
        provides { build_request }
        }

        action create_build {
        script { "John G. or Anton  creates build for testing." }
        agent { SrDeveloper || Developer }
        requires { build_request }
        provides { build }
        }

        iteration {
        action system_test_change {
            script { "QA lead performs system test to verify correct behavior." }
            agent { "QA lead" }
            requires { build }
            provides { dev_issue.status == "resolved" || build.failed_system_test || new_issue}
        }

        selection {
            action add_to_PMQ { /* Product Management Queue */
            requires { new_issue }
            provides { new_dev_issue }
            script { "QA lead adds new issue to Product Management Queue" }
            }
            action return_to_dev {
            requires { build.failed_system_test }
            provides { dev_issue.status == "none" }
            }
        }
        }
    }
    }

    
    iteration sprint_retrospective {
    action select_issue_for_demo {
        script { "Product Owner selects issue for demonstration in retrospective." }
        requires { dev_issue.status == "resolved" }
        provides { dev_issue.to_demo }
    }

    action demo_issue {
        script { "Developers demonstrate issue." }
        requires { dev_issue.to_demo }
        provides { dev_issue.demoed }
    }
    }

    iteration {
    action report_to_customer {
        script { "Tech support notifies customer that issue is changed and will be part of a future release." }
        requires { dev_issue.status == "resolved" }
        provides { dev_issue.fed_back_to_cust }
    }

    selection {
        sequence branch_exists {
        action copy_to_branch { 
            script { "If change should be included in branch, developer must copy code to unit on branch." }
            requires { dev_issue.status == "resolved" && unit.on_branch && !rel_branch.blocked}
            provides { dev_issue.status == "resolved" && unit.changed_on_branch }
            agent { Developer }
        }

        action test_change_on_branch { 
            script { "? tests change on branch" } /* Who does this? Who creates build? */
            requires { unit.changed_on_branch }
            provides { unit.tested_on_branch }
            agent { ExternalQA }
        }
        }

        action mark_for_future { /* XXX what happens to resolved issues that are blocked due to protected branch? */
        script { "Developer marks issue as needing to be copied to branch but blocked because branch is protected." }
        requires { dev_issue.status == "resolved" && unit.on_branch && rel_branch.blocked }
        provides { dev_issue.status == "resolved" && unit.on_branch && dev_issue.needs_copy_to_branch }
        agent { Developer }
        }
    }
    }
}
