%{
/************************************************************************
 * File:    parser.y                        *
 *                                  *
 * Description: This file contains the yacc specification for the   *
 *      parser.                         *
 ************************************************************************/

# include <stdio.h>
# include <pml/parser.h>
# include <pml/scanner.h>
# include <string.h>

/* Public variable definitions */

Graph program;

//integer to keep track of actions seen
//will be used when drawing swimlanes
//I had considered leaving this for the 
//program that will produce the diagrams
//but I think it makes more sense to do it here

int actionsSeen;
int flowControlsSeen;
int endsSeen; 
FILE *fp;
FILE *flowFile;

/*
A note about expressions:
In my opinion, if an agent is in any way connected to an action
That action should appear in their swimlane (regardless of way
in which agent field is made up with &s |s etc.

I need to confirm that all expressions boil down to primary expressions
The different types I think constitue different operations and that
won't affect me recording that an agent is involved with a particular
action.


My current list of jobs:
	**DONE** Record the agents for each action
	Write a program to produce an image for swimlanes
	serve that image back to the user
--JMB--
*/

/* Private function declarations */

static void and_trees (
# ifdef ANSI_PROTOTYPES
    Tree *      /* ptr  */,
    Tree        /* tree */
# endif
);
static void printKeyWordTree(
# ifdef ANSI_PROTOTYPES
    Tree /*tree*/,
    char *
# endif 
);
%}


%token ACTION AGENT BRANCH CREATES EXECUTABLE INPUT ITERATION MANUAL OUTPUT
%token PROCESS PROVIDES REQUIRES SCRIPT SELECTION SEQUENCE TOOL

%token OR AND EQ NE LE GE LT GT NOT DOT QUALIFIER
%token ID NUMBER STRING
%token JOIN RENDEZVOUS


%union {
    int           val;
    struct tree  *tree;
    struct graph *graph;
    char         *string;
}

%type <val> optional_type

%type <tree> identifier
%type <tree> expression
%type <tree> value_expression
%type <tree> string_expression
%type <tree> primary_expression
%type <tree> relation_expression
%type <tree> variable_expression
%type <tree> attribute_expression
%type <tree> disjunction_expression
%type <tree> conjunction_expression

%type <string> ID
%type <string> NUMBER
%type <string> STRING
%type <string> optional_name

%type <graph> primitive
%type <graph> action_header
%type <graph> branch_header
%type <graph> process_header
%type <graph> selection_header
%type <graph> action_primitive
%type <graph> branch_primitive
%type <graph> sequence_primitive
%type <graph> selection_primitive
%type <graph> iteration_primitive
%type <graph> concurrent_primitive_list
%type <graph> sequential_primitive_list
%%

process
    : process_header '{' sequential_primitive_list '}'
    {
        actionsSeen = 0;

        if ($3 != NULL)
        GraphInsert ($1, $3);
        else
        NodeLink ($1 -> source, $1 -> sink);

        program = $1;
    }
    ;


process_header
    : PROCESS ID
    {
        Node source = NodeCreate ($2, PROCESS, lineno);
        Node sink = NodeCreate ($2, PROCESS, lineno);
        $$ = GraphCreate (source, sink);
    }
    ;


concurrent_primitive_list
    : concurrent_primitive_list primitive
    {
        if ($2 != NULL)
        GraphInsert ($1, $2);
    }

    | /* empty */
    {
        $$ = $<graph>-1;
    }
    ;


sequential_primitive_list
    : sequential_primitive_list primitive
    {
        if ($1 == NULL)
        $$ = $2;
        else if ($2 != NULL)
        GraphLink ($1, $2);
    }

    | /* empty */
    {
        $$ = NULL;
    }
    ;


primitive
    : branch_primitive
    | selection_primitive
    | iteration_primitive
    | sequence_primitive
    | action_primitive
    ;


branch_primitive
    : branch_header '{' concurrent_primitive_list '}'
    {
        if ($3 == NULL)
        NodeLink ($1 -> source, $1 -> sink);
	if(flowFile==NULL){
	    flowFile = fopen("flowData.csv", "w");
	}
        //write out a line to the swim data file
        //and update how many actions we've seen
        fprintf(flowFile, "branchEnd,end,%d\n", --flowControlsSeen);
    }
    ;


branch_header
    : BRANCH optional_name
    {
        Node source = NodeCreate ($2, BRANCH, lineno);
        Node sink = NodeCreate ($2, RENDEZVOUS, lineno);
        $$ = GraphCreate (source, sink);
	if(flowFile==NULL){
	    flowFile = fopen("flowData.csv", "w");
	}
        //write out a line to the swim data file
        //and update how many actions we've seen
        fprintf(flowFile, "branchBegin,begin,%d\n", flowControlsSeen++);
    }
    ;


selection_primitive
    : selection_header '{' concurrent_primitive_list '}'
    {
        if ($3 == NULL)
        NodeLink ($1 -> source, $1 -> sink);
	if(flowFile==NULL){
	    flowFile = fopen("flowData.csv", "w");
	}
        //write out a line to the swim data file
        //and update how many actions we've seen
        fprintf(flowFile, "selectionEnd,end,%d\n",--flowControlsSeen);
    }
    ;


selection_header
    : SELECTION optional_name
    {
        Node source = NodeCreate ($2, SELECTION, lineno);
        Node sink = NodeCreate ($2, JOIN, lineno);
        $$ = GraphCreate (source, sink);
	if(flowFile==NULL){
	    flowFile = fopen("flowData.csv", "w");
	}
        //write out a line to the swim data file
        //and update how many actions we've seen
        fprintf(flowFile, "selectionBegin,begin,%d\n",flowControlsSeen++);
    }
    ;


iteration_primitive
    : iteration_header '{' sequential_primitive_list '}'
    {
        if ($3 != NULL)
        NodeLink ($3 -> sink, $3 -> source);

        $$ = $3;
	if(flowFile==NULL){
	    flowFile = fopen("flowData.csv", "w");
	}
        //write out a line to the swim data file
        //and update how many actions we've seen
        fprintf(flowFile, "iterationEnd,end,%d\n", --flowControlsSeen);
    }
    ;

iteration_header
    : ITERATION optional_name
    {
	if(flowFile==NULL){
	    flowFile = fopen("flowData.csv", "w");
	}
        //write out a line to the swim data file
        //and update how many actions we've seen
        fprintf(flowFile, "iterationBegin,begin,%d\n", flowControlsSeen++);
    }
    ;


sequence_primitive
    : SEQUENCE optional_name '{' sequential_primitive_list '}'
    {
        $$ = $4;
    }
    ;


optional_name
    : ID
    | /* empty */
    {
        $$ = "(anonymous)";
    }
    ;


action_primitive
    : action_header '{' specification_list '}'
    ;


action_header
    : ACTION ID optional_type
    {
        if(fp==NULL){
            //open the swimData file if it hasn't
            //been already
            fp = fopen("swimData.csv", "w");
        }
	if(flowFile==NULL){
	    flowFile = fopen("flowData.csv","w");
	}

        //write out a line to the swim data file
        //and update how many actions we've seen

        fprintf(fp, "action,%s,%d\n",$2, actionsSeen++);
        fprintf(flowFile, "action,%s,%d\n",$2, actionsSeen);

        Node node = NodeCreate ($2, ACTION, lineno);
        $$ = GraphCreate (node, node);
        node -> action_type = $3;
    }
    ;


optional_type
    : MANUAL
    {
        $$ = MANUAL;
    }

    | EXECUTABLE
    {
        $$ = EXECUTABLE;
    }

    | /* empty */
    {
        $$ = 0;
    }
    ;


specification_list
    : specification_list specification
    | /* empty */
    ;


specification
    : PROVIDES '{' expression '}'
    {
//        printKeyWordTree($3,"provides");
        and_trees (&($<graph>-2 -> source -> provides), $3);
    }

    | REQUIRES '{' expression '}'
    {
        //see comment for PROVIDES above
//        printKeyWordTree($3,"requires");
        and_trees (&($<graph>-2 -> source -> requires), $3);
    }

    | AGENT '{' expression '}'
    {
        printKeyWordTree($3,"agent");
        and_trees (&($<graph>-2 -> source -> agent), $3);
    }

    | SCRIPT '{' STRING '}'
    {
        
        $<graph>-2 -> source -> script = $3;
    }

    | TOOL '{' STRING '}'
    {
        
        $<graph>-2 -> source -> tool = $3;
    }
    ;


expression
    : disjunction_expression
    ;


disjunction_expression
    : conjunction_expression
    | disjunction_expression OR conjunction_expression
    {
        $$ = TreeCreate ($1, $3, "||", OR);
    }
    ;


conjunction_expression
    : relation_expression
    | conjunction_expression AND relation_expression
    {
        $$ = TreeCreate ($1, $3, "&&", AND);
    }
    ;

relation_expression
    : string_expression
    | primary_expression
    | value_expression EQ value_expression
    {
        $$ = TreeCreate ($1, $3, "==", EQ);
    }

    | value_expression NE value_expression
    {
        $$ = TreeCreate ($1, $3, "!=", NE);
    }

    | value_expression LT value_expression
    {
        $$ = TreeCreate ($1, $3, "<", LT);
    }

    | value_expression GT value_expression
    {
        $$ = TreeCreate ($1, $3, ">", GT);
    }

    | value_expression LE value_expression
    {
        $$ = TreeCreate ($1, $3, "<=", LE);
    }

    | value_expression GE value_expression
    {
        $$ = TreeCreate ($1, $3, ">=", GE);
    }

    | variable_expression EQ variable_expression
    {
        $$ = TreeCreate ($1, $3, "==", EQ);
    }

    | variable_expression NE variable_expression
    {
        $$ = TreeCreate ($1, $3, "!=", NE);
    }
    ;


primary_expression
    : variable_expression
    | attribute_expression
    | NOT primary_expression
    {
        $$ = TreeCreate (NULL, $2, "!", NOT);
    }

    | '(' expression ')'
    {
        $$ = $2;
    }
    ;


variable_expression
    : identifier
    | '(' identifier ')'
    {
        $$ = $2;
    }

    | '(' identifier ')' variable_expression
    {
        $$ = TreeCreate ($2, $4, "(qualifier)", QUALIFIER);
    }
    ;


attribute_expression
    : variable_expression DOT identifier
    {
        $$ = TreeCreate ($1, $3, ".", DOT);
    }
    ;


value_expression
    : attribute_expression
    | string_expression
    | NUMBER
    {
        $$ = TreeCreate (NULL, NULL, $1, lineno);
    }
    ;


string_expression
    : STRING
    {
        $$ = TreeCreate (NULL, NULL, $1, lineno);
    }
    ;


identifier
    : ID
    {
        $$ = TreeCreate (NULL, NULL, $1, lineno);
    }
    ;
%%


/************************************************************************
 * Function:    and_trees                       *
 *                                  *
 * Description: Links two trees as if specified in an AND expression.   *
 ************************************************************************/

static void and_trees (ptr, tree)
    Tree *ptr;
    Tree  tree;
{
    *ptr = (*ptr == NULL ? tree : TreeCreate (*ptr, tree, "&&", AND));
}

//a function to print out the agents to the csv file
static void printKeyWordTree(tree, descriptor)
    Tree tree;
    char * descriptor;
{
    if(tree != NULL){
        if(strcmp("&&", tree->sval) != 0 &&
            strcmp("||", tree->sval) != 0 )
        {
            if(fp==NULL){
            //open the swimData file if it hasn't
            //been already
                fp = fopen("swimData.csv", "w");
            }
	    if(flowFile==NULL){
		flowFile = fopen("flowData.csv", "w");
	    }
            //write out a line to the swim data file
            //and update how many actions we've seen
            if(strcmp("agent", descriptor) == 0){
                fprintf(fp, "%s,%s,%d\n",descriptor,tree->sval, actionsSeen);
            }
            fprintf(flowFile, "%s,%s,%d\n",descriptor,tree->sval, actionsSeen);
        }
        printKeyWordTree(tree->left, descriptor);
        printKeyWordTree(tree->right, descriptor);
    }
}
