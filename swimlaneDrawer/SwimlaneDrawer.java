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

    final static int SELECTION = 0;
    final static int ITERATION = 1;
    final static int BRANCH = 2;

    static List<Action> actionList;
    static ArrayList<Object> elements;

    static HashMap <String, Agent> agentMap;
    static String actionName;
    static int actionNumber;
    static int agentsSinceLastAction;
    static boolean firstAction;
    static int timeCount;
    static Agent currentAgent;
    static Canvas canvas;
    static SocialCanvas networkCanvas;
    static Action currentAction;



    public static int handleNest(FlowControl theFlow, int time){
      int currentTime = time;
      int type = theFlow.getType();
      List<Object> element = theFlow.getElementList();
      if( type == SELECTION || type == BRANCH){
        int selStartTime = currentTime;
        Object thisObject;
        Boolean flowContained = false;
        for(int i = 0; i < element.size(); i++){
          thisObject = element.get(i);
          if(thisObject instanceof Action){
            Action theAction = (Action)thisObject;
            List<Agent> thisObjectAgentList = theAction.getAgentList();
            for(int j = 0; j < thisObjectAgentList.size(); j++){
              canvas.addAction(thisObjectAgentList.get(j).getAgentNumber(), theAction.getActionName(), "orange", currentTime);
            }
          }
          else{
            FlowControl theFlowNest = (FlowControl) thisObject;
            flowContained = true;
            currentTime = handleNest(theFlowNest, currentTime);
          }
        }
        if(!flowContained){
          canvas.addSelection(selStartTime, selStartTime + 1);
        }
        else{
          canvas.addSelection(selStartTime, currentTime);
        }
        currentTime++;
      }
      if( type == ITERATION){
        Object thisObject;
        int iterStartTime = currentTime;

        for(int i = 0; i < element.size(); i++){
          thisObject = element.get(i);
          if(thisObject instanceof Action){
            Action theAction = (Action)thisObject;
            System.out.println(theAction.getActionName());
            List<Agent> thisObjectAgentList = theAction.getAgentList();
            for(int j = 0; j < thisObjectAgentList.size(); j++){
              canvas.addAction(thisObjectAgentList.get(j).getAgentNumber(), theAction.getActionName(), "aqua", currentTime);
            }
            currentTime++;
          }
          else{
            FlowControl theFlowNest = (FlowControl) thisObject;
            currentTime = handleNest(theFlowNest, currentTime);
          }
        }
        canvas.addIteration(iterStartTime, currentTime);
      }
      return currentTime;
    }
    public static ArrayList<Object> mapElement(List<List<String>> lines){
      ArrayList<Object> returnedElements = new ArrayList<Object>();
      List<String> currentLine;
      int maxLine;
      for(int i=0; i<lines.size(); i++){
          currentLine = lines.get(i);
          if(currentLine.get(ENTRY_TYPE).equals("action")){
            Action theAction = new Action(currentLine.get(ENTRY_NAME));
            List<String> nestLine;
            Boolean newElementFound = false;
            for(int j = i+1; j < lines.size() && !newElementFound; j++){
              nestLine = lines.get(j);
              if(nestLine.get(ENTRY_TYPE).equals("agent")){
                Agent theAgent;
                if(!agentMap.containsKey(nestLine.get(ENTRY_NAME))){
                    theAgent = new Agent(nestLine.get(ENTRY_NAME));
                    agentMap.put(theAgent.getName(), theAgent);
                }
                else{
                    theAgent = agentMap.get(nestLine.get(ENTRY_NAME));
                }
                theAction.addAgent(theAgent);
              }
              else{
                newElementFound = true;
                i = j - 1;
              }
            }
          System.out.println("I after Action: " + i);
          returnedElements.add(theAction);
        }
        if(currentLine.get(ENTRY_TYPE).equals("selectionBegin")){
          String selectIndex = currentLine.get(ACTION_NUMBER);
          int selectEnd = lines.size() - 1;
          Boolean endFound = false;
          List<String> nestLine;
          for(int j = i+1; j < lines.size() && !endFound; j++){
            nestLine = lines.get(j);
            if((nestLine.get(ENTRY_TYPE).equals("selectionEnd")) && (nestLine.get(ACTION_NUMBER).equals(selectIndex))){
              endFound = true;
              selectEnd = j + 1;
            }
          }
          FlowControl select = new FlowControl(SELECTION);
          System.out.println("Select " + (i+1) + " " + selectEnd);
          select.setList(mapElement(lines.subList(i+1, selectEnd)));
          returnedElements.add(select);
          i = selectEnd - 1;
        }
        if(currentLine.get(ENTRY_TYPE).equals("iterationBegin")){
          String iterIndex = currentLine.get(ACTION_NUMBER);
          int iterEnd = lines.size() - 1;
          Boolean endFound = false;
          List<String> nestLine;
          for(int j = i+1; j < lines.size() && !endFound; j ++){
            nestLine = lines.get(j);
            if((nestLine.get(ENTRY_TYPE).equals("iterationEnd")) && (nestLine.get(ACTION_NUMBER).equals(iterIndex))){
              endFound = true;
              iterEnd = j + 1;
            }
          }
          FlowControl iter = new FlowControl(ITERATION);
          System.out.println("Iter " + (i+1) + " " + iterEnd);
          iter.setList(mapElement(lines.subList(i+1, iterEnd)));
          returnedElements.add(iter);
          i = iterEnd-1;
        }
        if(currentLine.get(ENTRY_TYPE).equals("branchBegin")){
          String branchIndex = currentLine.get(ACTION_NUMBER);
          int branchEnd = lines.size() -1;
          Boolean endFound = false;
          List<String> nestLine;
          for(int j = i+1; j < lines.size() && !endFound; j ++){
            nestLine = lines.get(j);
            if((nestLine.get(ENTRY_TYPE).equals("branchEnd")) && (nestLine.get(ACTION_NUMBER).equals(branchIndex))){
              endFound = true;
              branchEnd = j + 1;
            }
          }
          FlowControl branch = new FlowControl(BRANCH);
          System.out.println("Branch " + (i+1) + " " + branchEnd);
          branch.setList(mapElement(lines.subList(i+1, branchEnd + 1)));
          returnedElements.add(branch);
          i = branchEnd -1;
        }
      }
      return returnedElements;
    }

    public static void main(String args[]){
        CSVReader actionsAndAgentsCSV;
        elements = new ArrayList<Object>();
        timeCount = 0;
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
                List<List<String>> csvList = new ArrayList<List<String>>();
                for(int i = 0; i < actionsAndAgentsCSV.getSize(); i++){
                  csvList.add(actionsAndAgentsCSV.getNextLine());
                }
                elements = mapElement(csvList);

                Agent[] agentArray = agentMap.values().toArray(new Agent[0]);
                for(int i = 0; i < agentArray.length; i++){
                    canvas.addAgent(agentArray[i].getAgentNumber(), agentArray[i].getName());
                }

                //adds blank row at the top to display flow control

                int time = 0;
                for(int i = 0; i < elements.size(); i++){
                    Object currentObject = elements.get(i);
                    if(currentObject instanceof Action){
                      Action theAction = (Action)currentObject;
                      ArrayList<Agent> currentAgents = theAction.getAgentList();
                      for(int j = 0; j < currentAgents.size(); j++){
                          canvas.addAction(currentAgents.get(j).getAgentNumber(), theAction.getActionName(), "teal", time);
                      }
                      time++;
                    }
                    else if(currentObject instanceof FlowControl){
                      FlowControl theFlowNest = (FlowControl) currentObject;
                      time = handleNest(theFlowNest, time);
                    }
                }
                canvas.FinishUp();
            }
            catch (Exception e){
                e.printStackTrace();
            }
        }

    }
}
