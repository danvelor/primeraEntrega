const optionsCourse = {
    course:{
        default:0,
        alias: 'c'
    },
    subscribed:{
        default:0,
        alias: 's'
    }
};
const optionsSubscribe = {
    name:{
        demand: true,
        alias: 'n'
    },
    dni:{
        demand: true,
        alias: 'd'
    },
    selected:{
        demand: true,
        alias: 's'
    }
};
const FILE = './courses.json';

const fs = require('fs');
const argv = require('yargs')
.command('course','Mostrar curso(s)',optionsCourse)
.command('subscribe','Inscribir curso(s)',optionsSubscribe)
.argv;

function main(){
    if(argv.course != undefined){
        showCorse(argv.course, argv.subscribed);
    }else if(argv.name != undefined){
        showSubscribed(argv.name,argv.dni,argv.selected);
    }else{
        welcome();
    }
}

function showCorse(id,subs){
    searchCourses(printCourse, id, subs);
}

function showSubscribed(name, dni, id){
    searchCourses(subscribeStudent, name, dni, id);
}

function searchCourses(continueWith){
    fs.readFile(FILE,(err, data)=>{
        if (err) return console.log("Ups algo salio mal leyendo el archivo. "+err);
        let courses = JSON.parse(data);
        let arg = Array.prototype.slice.call(arguments, 1);
        continueWith(courses,...arg);
    });
}

function printCourse(courses,idParam, subs){
    let time = 200;
    courses.forEach(element => {
        let {id='Vacio',name='Vacio',duration='Vacio',cost='Vacio',subscribed = []} = element;
        if(idParam === 0 || idParam=== id ){
            setTimeout(()=>{
                console.log('Curso '+name+'_________________________');
                console.log('   id: '+id);
                console.log('   Nombre: '+name);
                console.log('   Duración: '+duration);
                console.log('   Costo: '+cost);
                if(subs){
                    printSubscribed(subscribed);
                }
                console.log('Fin curso______________________');
            },time);
            time +=2000;
        }
    });
}

function printSubscribed(subscribed){
    console.log('   Numero de inscritos ' + subscribed.length +', inscritos:');
    subscribed.forEach(element => {
        let {name, dni} = element;
        console.log('       Nombre: '+name);
        console.log('       Documento: '+dni);
        console.log('       --------------------');
    });
}

function subscribeStudent(courses, nameStud,dni,selected){
    let update = courses.map(element =>{
        let {id='Vacio',subscribed = []} = element;

        if(id!=selected) return element;
        if( subscribed.some(elem=> elem.dni === dni)){
            console.log('-----------El estudiante ya se encuentra inscrito.----------');
            return element;
        }else{
            subscribed.push({name: nameStud, dni: dni});
            element.subscribed = subscribed;
            return element;
        }
    });
    let updateString = JSON.stringify(update);
    fs.writeFile(FILE, updateString, function (err) {
        if (err) return console.log('Fallo la suscripción: '+err);
        console.log('Fin de la inscripción!');
        showCorse(selected,true);
    });
}

function welcome(){
    console.log('Bienvenido a la primera entrega');
    console.log('Por favor seleccionar alguna de las opciones:');
    console.log('  1.comando "course", curso Id "-c=" y/o subscribed "-s=" opcionales ambos');
    console.log('  2.comando "subscribe" nombre "-n=", documento "-d=" y curso id "-s=" todos obligatorios');
}

main();