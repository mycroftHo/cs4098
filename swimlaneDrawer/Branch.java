import java.util.*;

public class Branch extends FlowControl{
    ArrayList<FLowControl> elementList;
    int branchNumber;
    int startTime;
    public Branch(int num, int start){
        branchNumber = num;
        startTime = start;
    }
    public void addElement(FlowControl element){
      elementList.add(element);
    }
    public List getElementList(){
      return elementList;
    }
    public int getBranchNumber(){
        return branchNumber;
    }
    public int getStartTime(){
      return startTime;
    }
}
