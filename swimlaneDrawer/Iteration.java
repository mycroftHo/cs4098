import java.util.*;

public class Iteration extends FlowControl{
    ArrayList<FlowControl> elementList;
    int iterationNumber;
    int startTime;
    public Iteration(Int num){
        iterationNumber = num;
        startTime;
    }
    public void addElement(FlowControl element){
      elementList.add(element);
    }
    public  List getElementList(){
      return elementList;
    }
    public int getIterationNumber(){
        return iterationNumber;
    }
    public int getStartTime(){
      return startTime;
    }
}
