import java.util.*;

public class Action{
    ArrayList<Agent> agentList;
    String actionName;
    public Action(String name){
        agentList = new ArrayList<Agent>();
        actionName = name;
    }

    public void addAgent(Agent theAgent){
        agentList.add(theAgent);
    }

    public ArrayList<Agent> getAgentList(){
        return agentList;
    }

    public String getActionName(){
        return actionName;
    }
}
