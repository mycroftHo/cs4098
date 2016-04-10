/*
Use a hash map to hold the agents
-key is string - agents name
-value is agent object itself

if agent seen & doesn't exist in hashmap
add it.

for each action:
    for each agent in action:
        add action to agent

after:
for each agent in HM:
    for each action in agent:
        print to file/append to string box(AgentXValue,ActionYValue, sizeX, sizeY)

Might not need an action class? use info from the csv?

Should probably creat the "None" agent at the start
Going to move some variables to increase scope and wrap up the printing function somewhere
*/

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.*;

public class SocialDrawer{
    final static int ENTRY_TYPE = 0;
    final static int ENTRY_NAME = 1;
    final static int ACTION_NUMBER = 2;

    static List<Action> actionList;
    static HashMap <String, Agent> agentMap;
    static String actionName ;
    static int actionNumber;
    static int agentsSinceLastAction;
    static boolean firstAction;
    static Agent currentAgent;
    static Canvas canvas;
    static SocialCanvas networkCanvas;
    static Action currentAction;



    private static void printAppropriateBoxes(List<String> csvLine, boolean lastLine){
        if(csvLine.get(ENTRY_TYPE).equals("action") && 
            firstAction && 
            agentsSinceLastAction == 0){
            firstAction = false;
            actionName = csvLine.get(ENTRY_NAME);
            actionNumber = 0;
            currentAction = new Action(actionName);
            actionList.add(currentAction);
            if(lastLine){
                currentAgent = agentMap.get("NONE");
                canvas.addAgent(currentAgent.getAgentNumber(), currentAgent.getName());
                canvas.addAction(currentAgent.getAgentNumber(), actionNumber, actionName);
            }
        }
        //no agents in previous action
        else if(csvLine.get(ENTRY_TYPE).equals("action") && 
            !firstAction &&
            agentsSinceLastAction == 0){
            currentAgent = agentMap.get("NONE");
            System.out.println("" + currentAgent.getName() + " number : "+  
                currentAgent.getAgentNumber() + " carries out " + actionName);
            canvas.addAgent(currentAgent.getAgentNumber(), currentAgent.getName());
            canvas.addAction(currentAgent.getAgentNumber(), actionNumber, actionName);
            //Then update deets
            agentsSinceLastAction = 0;
            actionName = csvLine.get(ENTRY_NAME);
            actionNumber ++;
            currentAction = new Action(actionName);
            actionList.add(currentAction);
            //the reason it won't print this out is cos
            //this never gets called again once we hit the end of the file.
            //if the last line is 
            if(lastLine){
                currentAgent = agentMap.get("NONE");
                canvas.addAgent(currentAgent.getAgentNumber(), currentAgent.getName());
                canvas.addAction(currentAgent.getAgentNumber(), actionNumber, actionName);
            }
        }
        else if(csvLine.get(ENTRY_TYPE).equals("action")){
            agentsSinceLastAction = 0;
            actionName = csvLine.get(ENTRY_NAME);
            actionNumber++;
            currentAction = new Action(actionName);
            actionList.add(currentAction);
            if(lastLine){
                currentAgent = agentMap.get("NONE");
                canvas.addAgent(currentAgent.getAgentNumber(), currentAgent.getName());
                canvas.addAction(currentAgent.getAgentNumber(), actionNumber, actionName);
            }
        }
        //agent seen
        else if(csvLine.get(ENTRY_TYPE).equals("agent")){
            agentsSinceLastAction++;
            if(!agentMap.containsKey(csvLine.get(ENTRY_NAME))){
                currentAgent = new Agent(csvLine.get(ENTRY_NAME));
                agentMap.put(currentAgent.getName(), currentAgent);
                canvas.addAgent(currentAgent.getAgentNumber(), currentAgent.getName());
            }
            else{
                currentAgent = agentMap.get(csvLine.get(ENTRY_NAME));
            }
            currentAction.addAgent(currentAgent);
            canvas.addAction(currentAgent.getAgentNumber(), actionNumber, actionName);
            System.out.println("" + currentAgent.getName() + " number : "+
                currentAgent.getAgentNumber() + " carries out " + actionName);
        }
    }

    public static void main(String args[]){
        CSVReader actionsAndAgentsCSV;
        actionList = new ArrayList<Action>();

        if(args.length != 1){
            System.out.println("Please include file name\nUsage: SwimlaneDrawer inputFileName");
        }
        else{
            try{
                canvas = new Canvas();
                networkCanvas = new SocialCanvas();
                actionsAndAgentsCSV = new CSVReader(args[0]);
                actionName = "";
                agentsSinceLastAction = 0;
                firstAction = true;
                agentMap = new HashMap<String, Agent>();
                currentAgent = new Agent("NONE");
                agentMap.put(currentAgent.getName(), currentAgent);

                for(int i = 0; i < actionsAndAgentsCSV.getSize(); i++){
                    List<String> csvLine = actionsAndAgentsCSV.getNextLine();
                    printAppropriateBoxes(csvLine, (i == actionsAndAgentsCSV.getSize() - 1));
                }
                canvas.FinishUp();

                Agent[] agentArray = agentMap.values().toArray(new Agent[0]);
                for(int i = 0; i < agentArray.length; i++){
		    if(agentArray[i].getName().equals("NONE")){
		    }
		    else{
                    	networkCanvas.addNode(agentArray[i].getAgentNumber(), agentArray[i].getName());
		    }
                }
                for(int i = 0; i < actionList.size(); i ++){
                    ArrayList<Agent> actionsAgents = actionList.get(i).getAgentList();
                    for(int j = 0; j < actionsAgents.size(); j++){
                        for(int k = j + 1; k < actionsAgents.size(); k++){
                            networkCanvas.addEdge(actionsAgents.get(j).getAgentNumber(),
                                actionsAgents.get(k).getAgentNumber(),
                                actionList.get(i).getActionName());
                        }
                    }
                }
                networkCanvas.FinishUp();
            }
            catch (Exception e){
                e.printStackTrace();
            }
        }
        
    }
}
