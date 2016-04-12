import java.io.PrintWriter;

public class Canvas{
    PrintWriter writer;
    String fileBody = "";
    String groupBody = "";
    String itemBody = "";
    boolean itemAdded;
    boolean groupAdded;
    int timeCount = 0;
    int actionCount = 0;
    int idNum = 0;

    public Canvas(){
        fileBody += "<!DOCTYPE html>\n";
        fileBody += "<html>\n";
        fileBody += "<body>\n";
        fileBody += "<script type=\"text/javascript\" src=\"node_modules/vis/dist/vis.js\"></script>\n";
        fileBody += "<link href=\"node_modules/vis/dist/vis.css\" rel=\"stylesheet\" type=\"text/css\" />\n";
        fileBody += "<div id=\"timeline\">\n";
        fileBody += "</div>\n";
        fileBody += "<p>Pink -> Branch/Selection<br/>Blue -> Iteration</p>\n";
        fileBody += "<script>\n";
        fileBody += "var container = document.getElementById(\"timeline\");\n";
        groupBody += "var groups = new vis.DataSet([\n";
        itemBody += "var items = new vis.DataSet([\n";
        fileBody += "var options = {editable: false, showMajorLabels: false, start: 000, groupEditable: true};\n";
        try{
            writer = new PrintWriter("swimlaneCanvas.html", "UTF-8");
        }
        catch(Exception e){
            e.printStackTrace();
        }
    }

    public void addAction(int agentNumber, String name, String color, int actionTime){
        if(!itemAdded){
          itemBody += "{id: " + idNum++ + ", content: '" + cleanUp(name) + "', start: " + actionTime + ", end: " + (actionTime + 1) + ", group: " + agentNumber + ", style: \"background-color:" + color + ";\"}";
          itemAdded = true;
        }
        else{
          itemBody += ",\n{id: " + idNum++ + ", content: '" + cleanUp(name) + "', start: " + actionTime + ", end: " + (actionTime + 1) + ", group: " + agentNumber + ", style: \"background-color:" + color + ";\"}";
        }
    }

    public void addSelection(int startTime, int endTime){
        if(!itemAdded){
          itemBody += "{id: " + idNum++ + ", content: \'Selection\', start: " + startTime + ", end: " + endTime + ", type: \'background\', style: \"background-color: pink; opacity: 0.5;\"}";
          itemAdded = true;
        }
        else{
          itemBody += ",\n{id: " + idNum++ + ", content: \'Selection\', start: " + startTime + ", end: " + endTime + ", type: \'background\', style: \"background-color: pink; opacity: 0.5;\"}";
        }
    }

    public void addIteration(int startTime, int endTime){
        if(!itemAdded){
          itemBody += "{id: " + idNum++ + ", content: \'Iteration\', start: " + startTime + ", end: " + endTime + ", type: \'background\', style: \"opacity: 0.4;\"}";
          itemAdded = true;
        }
        else{
          itemBody += ",\n{id: " + idNum++ + ", content: \'Iteration\', start: " + startTime + ", end: " + endTime + ", type: \'background\', style: \"opacity: 0.4;\"}";
        }
    }

    public void addAgent(int agentNumber, String name){

      if(!groupAdded){
        groupBody += "{id: " + agentNumber + ", content: '" + cleanUp(name) + "'}";
        groupAdded = true;
      }
      else{
        groupBody += ",\n{id: " + agentNumber + ", content: '" + cleanUp(name) + "'}";
      }
    }
    public String cleanUp(String name){
      return name.replaceAll("[^a-zA-Z, ]", "");
    }

    public void FinishUp(){
        itemBody += "]);\n";
        groupBody += "]);\n";
        fileBody += itemBody + "\n";
        fileBody += groupBody + "\n";
        fileBody += "var time = new vis.Timeline(container ,items, groups, options);\n";
        fileBody +=  "</script>\n";
        fileBody += "</body>\n";
        fileBody += "</html>\n";
        writer.println(fileBody);
        writer.close();
    }

    public static void main(String args[]){
        try{
            Canvas canvas = new Canvas();
            canvas.addAgent(0, "Jack");
            canvas.addAgent(1, "Andrew");
            canvas.addAgent(2, "Clare");
            canvas.FinishUp();
        }
        catch(Exception e){
            e.printStackTrace();
        }
    }

}
