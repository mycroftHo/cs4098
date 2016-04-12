process p {
	iteration{
    	action a{
        	agent{ x }
        }
        branch{
        	action b{
        		agent{ y }
        	}
            action c{
            	agent{ x }
            }
            iteration{
            	action d{
                	agent{ z }
                }
                action e{
                	agent{ x }
                }
            }
        }
        
    }
}