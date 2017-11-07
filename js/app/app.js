// Creation of data model
Ext.define('MyApp.model.News', {
	extend : 'Ext.data.Model',
	fields : [{
		name : 'ID',
		mapping : 'ID'
	}, {
		name : 'Titre',
		mapping : 'Titre'
	}, {
		name : 'Contenu',
		mapping : 'Contenu'
	}, {
		name : 'Date',
		mapping : 'Date'
	}]
});

Ext.onReady(function() {
	let panel1 = Ext.create('Ext.Panel', {
		height : 100,
		width : 200,
		title : 'Insider 1',
		html : 'Je suis dedans'
	});
	let panel2 = Ext.create('Ext.Panel', {
		height : 100,
		width : 200,
		title : 'Insider 2',
		html : 'Je suis dedans',
		style : {
			borderColor : 'red'
		},
	});

	let panel0 = Ext.create('Ext.panel.Panel', {
		layout : 'accordion',
		renderTo : 'helloWorldPanel',
		height : 200,
		width : 400,
		title : 'Outsider',
		items : [ panel1, panel2 ]
	});
	
	var gridStore = null;
	
	Ext.Ajax.request({
	    url: '/JavascriptComponents_WS/news.php',
	    method: 'POST',          
	    params: {
	    		m : 'all'
	    },
	    success: function(result){
	        let data = Ext.Array.map(Ext.util.JSON.decode(result.responseText)['root'], function (news) {
	            	return {
		    			ID: news.ID,
		    			Titre: news.Titre,
		    			Contenu: news.Contenu,
		    			Date: news.Date
	    			};
	    		});
	        
		    	gridStore = Ext.create('Ext.data.Store', {
		    		model : 'MyApp.model.News',
		    		data : data
		    	});
		    	
		    	populateGrid(gridStore);
	    },
	    failure: function(response, opts){
	        console.log("failed");
	    }
	});
	
	// Ext.Msg.alert('Are you ready?', 'I\'m fucking ready!');

    Ext.create('Ext.Button', {
       renderTo: Ext.getElementById('msgBox'),
       text: 'Click Me',
       listeners: {
          click: function() {
             Ext.MessageBox.confirm(
                'Confirm', 'Are you sure you want to do this ?', callbackFunction);
             function callbackFunction(btn) {
                if(btn == 'yes') {
                   Ext.Msg.alert ('Button Click', 'You clicked the Yes button');
                } else {
                   Ext.Msg.alert ('Button Click', 'You clicked the No button');
                }
             };
          }
       }
    });
});

function populateGrid(grid) {
	// Creation of first grid
	Ext.create('Ext.grid.Panel', {
		id : 'gridId',
		store : grid,
		stripeRows : true,
		title : 'News Grid', // Title for the grid
		renderTo : 'gridDiv', // Div id where the grid has to be rendered
		width : '100%',
		collapsible : true, // property to collapse grid
		enableColumnMove : true, // property which allows column to move to different position by dragging that column.
		enableColumnResize : true, // property which allows to resize column run time.

		columns : [
				{
					header : "Titre",
					dataIndex : 'Titre',
					id : 'ID',
					flex : .5, // property defines the amount of space this column is going to take in the grid container with respect to all.	
					sortable : true, // property to sort grid column data. 
					hideable : false
				// property which allows column to be hidden run time on user request.
				},
				{
					header : "Contenu",
					dataIndex : 'Contenu',
					flex : 1,
					sortable : true,
					hideable : true
				// this column will not be available to be hidden.
				},
				{
					header : "Date",
					dataIndex : 'Date',
					flex : .3,
					sortable : true,
					hideable : true
				} ]
	});
}