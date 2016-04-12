import java.util.*;

public class FlowControl{
    ArrayList<Object> elements;
    int type;
    public FlowControl(int theType){
        elements = new ArrayList<Object>();
        type = theType;
    }
    public void addElement(Object theElement){
        elements.add(theElement);
    }
    public ArrayList<Object> getElementList(){
        return elements;
    }
    public int getType(){
      return type;
    }
    public void setList(ArrayList<Object> flowElements){
      this.elements = flowElements;
    }
}
