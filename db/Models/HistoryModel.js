var HistoryModel= (function () {

    var collection_name= 'history';

    var loaded_Callback= function(){};
    var isLoaded= false;

    /**
     * Carga los datos si ya estan en localstorage
     */
    db.collection(collection_name, {capped: true, size: 100}).load(function (err, tableStats, metaStats) {
        if (!err) {
            loaded_Callback();
            isLoaded= true;
        }else{
            alert('Error al cargar colección '+collection_name)
        }
    });

    /**
     * @param data
     */
    var store = function(data){
        db.collection(collection_name).insert(data);
        db.collection(collection_name).save(function (err) {
            if (!err) {/* Save was successful */}
            else{ alert('Error al guardar en '+collection_name);}
        });
        return get();
    };

    var get = function(){
        var records= db.collection(collection_name).find({}, {
            $orderBy: {
                fecha: -1 // Sort ascending or -1 for descending
            }
        });
        if(records.length===0)
            return null;
        else
            return records;
    };

    var isEmpty = function(){
        return get() === null;
    };

    var loaded= function(callback){
        if(isLoaded)
            callback();
        else
            loaded_Callback= callback;
    };

    function construct(){//Funcion que controla cuales son los metodos publicos
        return {
            store             : store,
            get               : get,
            isEmpty           : isEmpty,
            loaded            : loaded
        }
    };
    return {construct:construct};//retorna los metodos publicos
})().construct();
