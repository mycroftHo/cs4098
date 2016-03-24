import java.io.PrintWriter;

public class Canvas{
    PrintWriter writer;
    String fileBody = "";
    private final int topGutter = 20;
    private final int gutter = 10;
    private final int textHeight = 25;
    private final int textAreaHeight = 40;
    private final int rectangleW = 200;
    private final int rectangleH = 100;
    private final int interAgentSpace = 30;

    //I\"m going to call the context ctx

    public Canvas(){
        fileBody += "<!DOCTYPE html>\n";
        fileBody += "<html>\n";
        fileBody += "<body>\n";
        fileBody += "<canvas id=\"myCanvas\" width=\"1200\" height=\"1200\" style=\"border:1px solid #000000;\">\n";
        fileBody += "</canvas>\n";
        fileBody += "<script>\n";
        fileBody += "var canvas = document.getElementById(\"myCanvas\");\n";
        fileBody += "var ctx = canvas.getContext(\"2d\");\n";
        fileBody += "ctx.font = \"25px Arial\";\n";
        fileBody += "canvas.style.backgroundColor = \'rgba(255, 255, 255, 1.0)\';\n";
        try{
            writer = new PrintWriter("swimlaneCanvas.html", "UTF-8");
        }
        catch(Exception e){
            e.printStackTrace();
        }
    }

    public void addAction(int agentNumberX, int actionNumberY, String name){
        int xPos = gutter + (agentNumberX * (rectangleW + interAgentSpace));
        int yPos = (textAreaHeight * 2) + (actionNumberY * ((3 * textHeight) + rectangleH));
        //fillRect(x,y,width,height);
        int textYPos = yPos + textHeight;
        int textXPos = xPos + textHeight;
        fileBody += "ctx.fillText(\""+ name +"\"," + textXPos + "," + textYPos + ");\n";
        fileBody += "ctx.strokeRect(" + xPos + "," + yPos + "," + rectangleW + "," + rectangleH + ");\n";
    }

    public void addAgent(int agentNumberX, String name){
        int xPos = gutter + (agentNumberX * (rectangleW + interAgentSpace));
        fileBody += "ctx.fillText(\"" + name +"\"," + xPos + "," + topGutter + ");\n";
    }

    public void FinishUp(){
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
            canvas.addAction(0,0,"hello");
            canvas.addAction(2,0,"heyt");
            canvas.addAction(1,1,"wow");
            canvas.FinishUp();
        }
        catch(Exception e){
            e.printStackTrace();
        }
    }

}