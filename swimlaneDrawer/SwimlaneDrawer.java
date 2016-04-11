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
    static List<Object> elements;

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
        for(int i = 0; i < element.size(); i++){
          thisObject = element.get(i);
          if(thisObject instanceof Action){
            Action theAction = (Action)thisObject;
            List<Agent> thisObjectAgentList = theAction.getAgentList();
            for(int j = 0; j < thisObjectAgentList.size(); j++){
              canvas.addAction(thisObjectAgentList.get(j).getAgentNumber(), theAction.getActionName(), time);
            }
          }
          else{
            FlowControl theFlowNest = (FlowControl) thisObject;
            currentTime = handleNest(theFlowNest, currentTime);
          }
        }
        canvas.addSelection(selStartTime, currentTime);
        currentTime++;
      }
      if( type == ITERATION){
        Object thisObject;
        int iterStartTime = currentTime;
        for(int i = 0; i < element.size(); i++){
          thisObject = element.get(i);
          if(thisObject instanceof Action){
            Action theAction = (Action)thisObject;
            List<Agent> thisObjectAgentList = theAction.getAgentList();
            for(int j = 0; j < thisObjectAgentList.size(); j++){
              canvas.addAction(thisObjectAgentList.get(j).getAgentNumber(), theAction.getActionName(), time);
            }
          }
          else{
            FlowControl theFlowNest = (FlowControl) thisObject;
            currentTime = handleNest(theFlowNest, currentTime);
          }
          currentTime++;
        }
        canvas.addIteration(iterStartTime, currentTime);
        currentTime++;
      }
      return currentTime;
    }
    public static List<Object> mapElement(List<List<String>> lines){
      List<Object> returnedElements = new ArrayList<Object>();
      List<String> currentLine;
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
              //this is madness
              //else if((nestLine.get(ENTRY_TYPE).equals("selectionBegin"))||(nestLine.get(ENTRY_TYPE).equals("selectionEnd"))||(nestLine.get(ENTRY_TYPE).equals("requires"))||(nestLine.get(ENTRY_TYPE).equals("provides"))||(nestLine.get(ENTRY_TYPE).equals("iterationBegin"))||(nestLine.get(ENTRY_TYPE).equals("iterationEnd"))||(nestLine.get(ENTRY_TYPE).equals("branchBegin"))||(nestLine.get(ENTRY_TYPE).equals("branchEnd"))(nestLine.get(ENTRY_TYPE).equals("action"))){
              else{
                newElementFound = true;
                j--;
                i = j - 1;
              }
            }
          }
          returnedElements.add(theAction);
        }
        if(currentLine.get(ENTRY_TYPE).equals("selectionBegin")){
          String selectIndex = currentLine.get(ACTION_NUMBER);
          int selectEnd = lines.size() -1;
          Boolean endFound = false;
          List<String> nestLine;
          for(int j = i+1; j < lines.size() && !endFound; j ++){
            nestLine = lines.get(j);
            if((nestLine.get(ENTRY_TYPE).equals("selectionEnd")) && (nestLine.get(ACTION_NUMBER).equals(selectIndex))){
              endFound = true;
              selectEnd = j;
            }
          }
          FlowControl select = new FlowControl(SELECTION);
          select.addElement(mapElement(lines.subList(i+1, selectEnd)));
          returnedElements.add(select);
          i = selectEnd + 1;
        }
        if(currentLine.get(ENTRY_TYPE).equals("iterationBegin")){
          String selectIndex = currentLine.get(ACTION_NUMBER);
          int selectEnd = lines.size() -1;
          Boolean endFound = false;
          List<String> nestLine;
          for(int j = i+1; j < lines.size() && !endFound; j ++){
            nestLine = lines.get(j);
            if((nestLine.get(ENTRY_TYPE).equals("iterationEnd")) && (nestLine.get(ACTION_NUMBER).equals(selectIndex))){
              endFound = true;
              selectEnd = j;
            }
          }
          FlowControl iter = new FlowControl(ITERATION);
          iter.addElement(mapElement(lines.subList(i+1, selectEnd)));
          returnedElements.add(iter);
          i = selectEnd + 1;
        }
        if(currentLine.get(ENTRY_TYPE).equals("branchBegin")){
          String selectIndex = currentLine.get(ACTION_NUMBER);
          int selectEnd = lines.size() -1;
          Boolean endFound = false;
          List<String> nestLine;
          for(int j = i+1; j < lines.size() && !endFound; j ++){
            nestLine = lines.get(j);
            if((nestLine.get(ENTRY_TYPE).equals("branchEnd")) && (nestLine.get(ACTION_NUMBER).equals(selectIndex))){
              endFound = true;
              selectEnd = j;
            }
          }
          FlowControl branch = new FlowControl(BRANCH);
          branch.addElement(mapElement(lines.subList(i+1, selectEnd)));
          returnedElements.add(branch);
          i = selectEnd + 1;
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
                for(int i = 0; i < elements.size(); i++){
                }
                /*for(int i = 0; i < actionsAndAgentsCSV.getSize(); i++){
                    List<String> csvLine = actionsAndAgentsCSV.get(i);
                    if(csvLine.get(ENTRY_TYPE).equals("action")){
                      currentAction = new Action(actionName);
                    }
                    if(csvLine.get(ENTRY_TYPE).equals("agent")){
                      currentAgent = new Agent(csvLine.get(ENTRY_NAME));
                      if(!agentMap.containsKey(csvLine.get(ENTRY_NAME))){
                          currentAgent = new Agent(csvLine.get(ENTRY_NAME));
                          agentMap.put(currentAgent.getName(), currentAgent);
                      }
                      else{
                          currentAgent = agentMap.get(csvLine.get(ENTRY_NAME));
                      }
                      currentAction.addAgent(currentAgent);
                      agentMap.put(currentAgent.getName(), currentAgent);
                    }
                    if(csvLine.get(ENTRY_TYPE).equals("selection")){
                      String id = csvLine.get(ACTION_NUMBER);
                      int index;
                      boolean foundEnd = false;
                      for(int j = i + 1; (j < actionsAndAgentsCSV.getSize() && !foundEnd); j++){
                        List<String> currentLine = actionsAndAgentsCSV.get(j);
                        if(currentLine.get(ENTRY_TYPE).equals("selectionEnd") && currentLine.get(ACTION_NUMBER).equals(id)){
                          foundEnd = true;
                        }
                      }
                    }
                }*/

                Agent[] agentArray = agentMap.values().toArray(new Agent[0]);
                for(int i = 0; i < agentArray.length; i++){
                    canvas.addAgent(agentArray[i].getAgentNumber(), agentArray[i].getName());
                }
                int time = 0;
                for(int i = 0; i < elements.size(); i++){
                    Object currentObject = elements.get(i);
                    if(currentObject instanceof Action){
                      Action theAction = (Action)currentObject;
                      ArrayList<Agent> currentAgents = theAction.getAgentList();
                      for(int j = 0; j < currentAgents.size(); j++){
                          canvas.addAction(currentAgents.get(j).getAgentNumber(), theAction.getActionName(), time);
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
