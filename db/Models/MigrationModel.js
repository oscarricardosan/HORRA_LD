
var MigrationModel= (function () {

    var collection_name= 'migrations';

    var loaded_Callback= function(){};
    var isLoaded= false;
    /**
     * Carga los datos si ya estan en localstorage
     */
    db.collection(collection_name).load(function (err, tableStats, metaStats) {
        if (!err) {
            loaded_Callback();
            isLoaded= true;
        }else{
            alert('Error al cargar colección '+collection_name)
        }
    });

    /**
     * @returns {boolean}
     */
    var collectionExists= function(){
        return db.collection(collection_name).find().length > 0;
    }

    /**
     * @param migration_id
     * @returns {boolean}
     */
    var migrationWasExecuted = function(migration_id){
        return db.collection(collection_name).find({_id: migration_id}).length > 0;
    }

    /**
     * @param migration_id
     * @param description
     */
    var store = function(migration_id, description){
        db.collection(collection_name).insert({
            _id: migration_id,
            descripcion: description
        });

        db.collection(collection_name).save(function (err) {
            if (!err) {/* Save was successful */}
            else{ alert('Error al guardar en '+collection_name);}
        });
    };

    var loaded= function(callback){
        if(isLoaded)
            callback();
        else
            loaded_Callback= callback;
    };

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            collectionExists    : collectionExists,
            migrationWasExecuted    : migrationWasExecuted,
            store    : store,
            loaded    : loaded
        }
    };
    return {construct:construct};//retorna los metodos publicos
})().construct();
