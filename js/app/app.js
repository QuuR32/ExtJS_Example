// const AJAX_BASE_URL = 'http://atelierlibre.url.ph/app/JavascriptComponents_WS/';
const AJAX_BASE_URL = '/JavascriptComponents_WS/';

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
	
    Ext.create('Ext.Button', {
    		renderTo: 'butAjouterNews',
    		text: 'Ajouter une news',
    		listeners: {
    			click: function() {
    				let emptyRecord = Ext.create('Ext.data.Record', {
    					ID: -1,
    					Titre: "",
    					Contenu: "",
    					Date: ""
    				});
    				winDisplayNews.down('form').getForm().loadRecord(emptyRecord);
    				winDisplayNews.show();
    			}
    		}
	});
});

function populateGrid(grid) {
	let gridNews = Ext.create('Ext.grid.Panel', {
		id : 'gridNews',
		store : grid,
		stripeRows : true,
		title : 'News',
		renderTo : 'divGridNews',
		width : '80%',
		collapsible : true,
		enableColumnMove : true,
		enableColumnResize : true,
		pageSize: 5,
		listeners: {
			itemclick: function(dv, record, item, index, e) {
				if(!record.forDelete) {
					winDisplayNews.down('form').getForm().loadRecord(record);
					winDisplayNews.show();
				}
			}
		},

		columns : [
			{
				header : "Date",
				dataIndex : 'Date',
				flex : .3,
				sortable : true,
				hideable : true,
				align: 'left'
			},{
				header : "Titre",
				dataIndex : 'Titre',
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
				header: '',
				dataIndex : 'delete',
				flex : .05,
				sortable : false,
				hideable : true,
				align: 'right',
				renderer: function (value, metaData, record, row, col, store, gridView) {
					setTimeout(function() {	
						var button = Ext.create('Ext.button.Button', {
							renderTo: 'butDeleteNews_' + record.data.ID,
					    		text: 'x',
					    		style: {
					    			backgroundColor: 'Crimson'
					    		}
						});
						button.on('click', function(e) {
							record.forDelete = true;
							
							Ext.Ajax.request({
							    url: AJAX_BASE_URL + 'news.php',
							    method: 'POST',
							    params: {
							    		m : 'delete',
							    		ID: record.data.ID
							    },
							    contentType: "application/json; charset=utf-8",
							    success: function(result) {
								    store.remove(record);
								    store.reload();
							    },
							    failure: function(response, opts) {
									Ext.Msg.alert('Erreur', 'Une erreur s\'est produite lors de votre enrregistrement, merci de réessayer ultérieurement.');
							    }
							});
			    			});
					}, 1);
					return '<div id="butDeleteNews_' + record.data.ID + '"></div>';
				}
			} ]
	});

	Ext.getCmp('gridNews').store.reload();
};

var winDisplayNews = new Ext.Window({
	title : 'News',
	layout : 'form',
	width : '50%',
	closeAction : 'close',
	target : document.getElementById('divWinDisplayNews'),
	plain : false,

	items : [ {
        xtype:'form',
		items : [ {
				xtype : 'hidden',
				fieldLabel : 'id',
				name : 'id'
			}, {
		        	xtype : 'hidden',
				fieldLabel : 'ID',
				name : 'ID'
			}, {
		        	xtype : 'hidden',
				fieldLabel : 'Date',
				name : 'Date'
			}, {
				xtype : 'textfield',
				fieldLabel : 'Titre',
				name : 'Titre',
				width: '100%'
			}, {
				xtype : 'textarea',
				fieldLabel : 'Contenu',
				name : 'Contenu',
				width: '100%',
				height: '200px'
			} ]
	} ],

	buttons : [ {
		text : 'Enregistrer',
		handler : function() {
			let formValues = winDisplayNews.down('form').getForm().getValues();
			let method = (formValues.ID == "-1" ? 'add' : 'update');
			Ext.Ajax.request({
			    url: AJAX_BASE_URL + 'news.php',
			    method: 'POST',
			    params: {
			    		m : method,
			    		ID: formValues.ID,
			    		Titre: JSON.stringify(formValues.Titre),
			    		Contenu: JSON.stringify(formValues.Contenu)
			    },
			    contentType: "application/json; charset=utf-8",
			    success: function(result) {
			    		let record = {};
			    		if(result.responseText == "1") {
			    			// CASE Update
			    			record = {
				    			id: formValues.id,
				    			ID: formValues.ID,
				    			Titre: formValues.Titre,
				    			Contenu: formValues.Contenu,
				    			Date: formValues.Date
				    		};
			    		} else {
			    			// CASE Create
					    	let news = Ext.util.JSON.decode(result.responseText)[0];
				        	record = {
				    			ID: news.news.ID,
				    			Titre: news.news.Titre,
				    			Contenu: news.news.Contenu,
				    			Date: news.news.Date
				    		};
			    		}
			        	Ext.getCmp('gridNews').store.add(record);
			        	Ext.getCmp('gridNews').store.reload();
					winDisplayNews.close();
			    },
			    failure: function(response, opts){
					Ext.Msg.alert('Erreur', 'Une erreur s\'est produite lors de votre enrregistrement, merci de réessayer ultérieurement.');
			    }
			});
		}
	}, {
		text : 'Annuler',
		handler : function() {
			winDisplayNews.close();
		}
	} ],
	buttonAlign : 'center'
});