const AJAX_BASE_URL = 'http://atelierlibre.url.ph/app/JavascriptComponents_WS/';
//const AJAX_BASE_URL = '/JavascriptComponents_WS/';

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
	Ext.Ajax.request({
	    url: AJAX_BASE_URL + 'news.php',
	    method: 'POST',          
	    params: {
	    		m : 'all'
	    },
	    contentType: "application/json; charset=utf-8",
	    success: function(result) {
	        let data = Ext.Array.map(Ext.util.JSON.decode(result.responseText), function (news) {
	        		return {
		    			ID: news.news.ID,
		    			Titre: news.news.Titre,
		    			Contenu: news.news.Contenu,
		    			Date: news.news.Date
	    			};
	    		});
	        
		    	let gridStore = Ext.create('Ext.data.Store', {
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
		title : 'News',
		renderTo : 'gridDiv',
		width : '80%',
		collapsible : true,
		enableColumnMove : true,
		enableColumnResize : true,

		columns : [
			{
				header : "Titre",
				dataIndex : 'Titre',
				id : 'ID',
				flex : .5,
				sortable : true,
				hideable : false
			},
			{
				header : "Contenu",
				dataIndex : 'Contenu',
				flex : 1,
				sortable : true,
				hideable : true
			},
			{
				header : "Date",
				dataIndex : 'Date',
				flex : .3,
				sortable : true,
				hideable : true,
				align: 'right'
			} ]
	});
}