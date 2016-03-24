public class Agent{
    private int agentNumber;
    private static int agentsCreated = 0;
    private String agentName;
    public Agent(String name){
        agentNumber = agentsCreated++;
        agentName = name;
    }

    public int getAgentNumber(){
        return agentNumber;
    }

    public String getName(){
        return agentName;
    }

    public int getAgentOffset(){
        //for now return agent number
        //something more sophisticated later
        return agentNumber;
    }
}