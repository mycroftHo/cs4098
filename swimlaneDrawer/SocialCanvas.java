import java.io.PrintWriter;

public class SocialCanvas{
    PrintWriter writer;
    String fileBody = "";
    String nodeBody = "";
    String edgeBody = "";
    Boolean nodeAdded = false;
    BOolean edgeAdded = false;


    //I\"m going to call the context ctx

    public SocialCanvas(){
        fileBody += "<!DOCTYPE html>\n";
        fileBody += "<html>\n";
        fileBody += "<head>\n";
        fileBody += "<title>Social Network</title>";
        fileBody += " <style type=\"text/css\">\n";
        fileBody += "#mynetwork {\n";
        fileBody += "width: 600px;\n";
        fileBody += "height: 400px;\n";
        fileBody += "border: 1px solid lightgray;}\n"
        fileBody += "</style>";
        fileBody += "</head>\n";
        fileBody += "<body>\n";
        fileBody += "<div id=\"myNetwork\">\n";
        fileBody += "</div>\n";
        fileBody += "<script>\n";
        fileBody += "var net = document.getElementById(\"myNetwork\");\n";
        nodeBody += "var nodes = new vis.DataSet([\n";
        edgeBody += "var edges = new vis.DataSet([\n";
        try{
            writer = new PrintWriter("SocialCanvas.html", "UTF-8");
        }
        catch(Exception e){
            e.printStackTrace();
        }
    }

    public void addNode(int from, int to, String label){
      if(!nodeAdded){
        nodeBody += "{ from: " + from + ", to: " + to + ", label: " + label + "}";
        nodeAdded = true;
      }
      else{
        nodeBody += ",\n{ from: " + from + ", to: " + to + ", label: " + label + "}";
      }
    }

    public void addEdge(int agentId, String agentLabel){
      if(!edgeAdded){
        edgeBody += "{id: " + agentId + ", label: " + label + "}";
        edgeAdded = true;
      }
      else{
        edgeBody += ",\n{id: " + agentId + ", label: " + label + "}";
      }
    }

    public void FinishUp(){
        nodeBody += "\n]);\n";
        edgeBody += "\n]);\n";
        fileBody += nodeBody;
        fileBody += edgeBody;
        fileBody += "var data = {\n";
        fileBody += "nodes : nodes,\n";
        fileBody += "edges: edges\n";
        fileBody += "};\n";
        fileBody += "var options = {}\n";
        fileBody += "var socialNet = new vis.Network(container, data, options);\n"
        fileBody +=  "</script>\n";
        fileBody += "</body>\n";
        fileBody += "</html>\n";
        writer.println(fileBody);
        writer.close();
    }

    public static void main(String args[]){
        try{
            Canvas canvas = new Canvas();
            canvas.FinishUp();
        }
        catch(Exception e){
            e.printStackTrace();
        }
    }

}
