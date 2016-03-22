/*
Structure - 
    A CSVReader object that reads a csv and provides a List<List<String>> object
*/

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.*;

public class SwimlaneDrawer{
    public static void main(String args[]){
        CSVReader actionsAndAgentsCSV;
        if(args.length != 1){
            System.out.println("Please include file name\nUsage: <SwimlaneDrawer filename>");
        }
        else{
            try{
                actionsAndAgentsCSV = new CSVReader(args[0]);
                List<String> csvLine= actionsAndAgentsCSV.getNextLine();
                for(int i = 0; i < csvLine.size(); i++){
                    System.out.println(csvLine.get(i));
                }
            }
            catch (Exception e){
                e.printStackTrace();
            }
        }
        
    }
}