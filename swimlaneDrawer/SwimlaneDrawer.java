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

public class SwimlaneDrawer{
    final static int ENTRY_TYPE = 0;
    final static int ENTRY_NAME = 1;
    final static int ACTION_NUMBER = 2;

    static HashMap <String, Agent> agentMap;
    static String actionName ;
    static int actionNumber;
    static int agentsSinceLastAction;
    static boolean firstAction;
    static Agent currentAgent;
    static Canvas canvas;



    private static void printAppropriateBoxes(List<String> csvLine){
        if(csvLine.get(ENTRY_TYPE).equals("action") && 
            firstAction && 
            agentsSinceLastAction == 0){
            firstAction = false;
            actionName = csvLine.get(ENTRY_NAME);
            actionNumber = 0;
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
            canvas.addAction(currentAgent.getAgentNumber(), actionNumber, actionName);
            System.out.println("" + currentAgent.getName() + " number : "+
                currentAgent.getAgentNumber() + " carries out " + actionName);
        }
    }

    public static void main(String args[]){
        CSVReader actionsAndAgentsCSV;

        if(args.length != 1){
            System.out.println("Please include file name\nUsage: SwimlaneDrawer inputFileName");
        }
        else{
            try{
                canvas = new Canvas();
                actionsAndAgentsCSV = new CSVReader(args[0]);
                actionName = "";
                agentsSinceLastAction = 0;
                firstAction = true;
                agentMap = new HashMap<String, Agent>();
                currentAgent = new Agent("NONE");
                agentMap.put(currentAgent.getName(), currentAgent);

                for(int i = 0; i < actionsAndAgentsCSV.getSize(); i++){
                    List<String> csvLine= actionsAndAgentsCSV.getNextLine();
                    printAppropriateBoxes(csvLine);
                }
                canvas.FinishUp();
            }
            catch (Exception e){
                e.printStackTrace();
            }
        }
        
    }
}
