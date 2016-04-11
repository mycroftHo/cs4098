import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.*;
import java.io.BufferedReader;

public class CSVReader{
    List<List<String>> csvData;
    BufferedReader fileReader = null;
    int linesGiven;

    //constructor takes a file name and
    //creates a List<List<String>> object
    //So first list is lines
    //second list is each word in line delimited by ",""
    public CSVReader(String fileName){
       //open the file and create our List List String
        try{
            String line = "";
            csvData = new ArrayList<List<String>>();
            linesGiven = 0;

            /*
            in a while loop
            create a new ArrayList<String> - should be called currentLine
            Add elements to this as they come in
            add this ArrayList<String> to the
            top list called csvData
            */

            fileReader = new BufferedReader(new FileReader(fileName));
            //in here we do the processing of the csv
            while ((line = fileReader.readLine()) != null) {
                List<String> currentLine = new ArrayList<String>();
                String[] tokens = line.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");
                for(int i = 0; i < tokens.length; i++){
                    currentLine.add(tokens[i]);
                }
                csvData.add(currentLine);
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        finally {
            try {
                fileReader.close();
            } catch (IOException e) {
                System.out.println("Error while closing fileReader !!!");
                e.printStackTrace();
            }
        }
    }

    public List<String> getNextLine(){
        if(csvData != null && linesGiven < csvData.size())
            return csvData.get(linesGiven++);
        else
            return null;
    }

    public int getSize(){
        return csvData.size();
    }
}
