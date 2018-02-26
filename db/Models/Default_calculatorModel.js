var Default_calculatorModel= (function () {

    var collection_name= 'default_calculator';

    var loaded_Callback= function(){};
    var isLoaded= false;

    /**
     * Carga los datos si ya estan en localstorage
     */
    db.collection(collection_name, {capped: true, size: 1}).load(function (err, tableStats, metaStats) {
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
    var insertOrUpdate = function(data){
        data._id= 1;
        db.collection(collection_name).upsert(data);
        db.collection(collection_name).save(function (err) {
            if (!err) {/* Save was successful */}
            else{ alert('Error al guardar en '+collection_name);}
        });
    };

    /**
     * @param _id
     * @param data
     */
    var update = function(_id, data){
        db.collection(collection_name).update({
            _id: _id
        }, data);
        return get();
    };

    /**
     * @param data
     */
    var store = function(data){
        data._id= 1;
        db.collection(collection_name).insert(data);
        db.collection(collection_name).save(function (err) {
            if (!err) {/* Save was successful */}
            else{ alert('Error al guardar en '+collection_name);}
        });
        return get();
    };

    var get = function(){
        var records= db.collection(collection_name).find();
        if(records.length===0)
            return null;
        else
            return records[0];
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
            insertOrUpdate    : insertOrUpdate,
            get               : get,
            isEmpty           : isEmpty,
            loaded            : loaded
        }
    };
    return {construct:construct};//retorna los metodos publicos
})().construct();
