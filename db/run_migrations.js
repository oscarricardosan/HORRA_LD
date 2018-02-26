MigrationModel.loaded(function(){
    (function verifyExistenceOfCollection_migrations(){
        if(!MigrationModel.collectionExists()){
            MigrationModel.store(0, 'Primer Migracion. Se guarda colección de migraciones.');
            console.log('Migration 0 executed');
        }
    })();

/*
    if(!MigrationModel.migrationWasExecuted(1)){
        Default_calculatorModel.insertOrUpdate({empty: true});
        MigrationModel.store(1, 'Se crea colección para valores por defecto de la calculadora.');
        console.log('Migration 1 executed');
    }

    if(!MigrationModel.migrationWasExecuted(2)){
        Default_emailModel.insertOrUpdate({empty: true});
        MigrationModel.store(2, 'Se crea colección para valores por defecto de la calculadora.');
        console.log('Migration 2 executed');
    }*/
});