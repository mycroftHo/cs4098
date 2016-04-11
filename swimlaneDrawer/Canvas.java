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
        fileBody += "<script>\n";
        fileBody += "var container = document.getElementById(\"timeline\");\n";
        groupBody += "var groups = new vis.DataSet([\n";
        itemBody += "var items = new vis.DataSet([\n";
        fileBody += "var options = {editable: false, showMajorLabels: false, start: 000};\n";
        try{
            writer = new PrintWriter("swimlaneCanvas.html", "UTF-8");
        }
        catch(Exception e){
            e.printStackTrace();
        }
    }

    public void addAction(int agentNumber, String name, int actionTime){
        if(!itemAdded){
          itemBody += "{id: " + idNum++ + ", content: '" + cleanUp(name) + "', start: " + actionTime + ", end: " + (actionTime + 1) + ", group: " + agentNumber + "}";
          itemAdded = true;
        }
        else{
          itemBody += ",\n{id: " + idNum++ + ", content: '" + cleanUp(name) + "', start: " + actionTime + ", end: " + (actionTime + 1) + ", group: " + agentNumber + "}";
        }
    }

    public void addSelection(int startTime, int endTime){
        if(!itemAdded){
          itemBody += "{id: " + idNum++ + ", content: \'Selection\', start: " + startTime + ", end: " + endTime + ", type: \'background\', style: \"background-color: pink;\"}";
          itemAdded = true;
        }
        else{
          itemBody += ",\n{id: " + idNum++ + ", content: \'Selection\', start: " + startTime + ", end: " + endTime + ", type: \'background\', style: \"background-color: pink;\"}";
        }
    }

    public void addIteration(int startTime, int endTime){
        if(!itemAdded){
          itemBody += "{id: " + idNum++ + ", content: \'Iteration\', start: " + startTime + ", end: " + endTime + ", type: \'background\'}";
          itemAdded = true;
        }
        else{
          itemBody += ",\n{id: " + idNum++ + ", content: \'Iteration\', start: " + startTime + ", end: " + endTime + ", type: \'background\'}";
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
      return name.replaceAll("[^a-zA-Z, ]", "").toLowerCase();
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

/*var items = new vis.DataSet([
    {id: 'A', content: 'Period A', start: '2014-01-16', end: '2014-01-22', type: 'background', group: 1},
    {id: 'B', content: 'Period B', start: '2014-01-23', end: '2014-01-26', type: 'background', group: 2},
    {id: 'C', content: 'Period C', start: '2014-01-27', end: '2014-02-03', type: 'background'}, // no group
    {id: 'D', content: 'Period D', start: '2014-01-14', end: '2014-01-20', type: 'background', group: 'non-existing'},
    {id: 1, content: 'item 1<br>start', start: '2014-01-30', group: 1},
    {id: 2, content: 'item 2', start: '2014-01-18', group: 1},
    {id: 3, content: 'item 3', start: '2014-01-21', group: 2},
    {id: 4, content: 'item 4', start: '2014-01-17', end: '2014-01-21', group: 2},
    {id: 5, content: 'item 5', start: '2014-01-28', type:'point', group: 2},
    {id: 6, content: 'item 6', start: '2014-01-25', group: 2}
  ]);*/
