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
        alias: 'x'
    },
    selected:{
        demand: true,
        alias: 'i'
    }
};
const FILE = './courses.json';

const fs = require('fs');
const argv = require('yargs')
.command('course','Mostrar curso(s)',optionsCourse)
.command('inscribir','Inscribir curso(s)',optionsSubscribe)
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
    let time = 2000;
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
    let notFinded = false;
    let update = courses.map(element =>{
        let {id='Vacio',subscribed = []} = element;

        if(id!=selected) return element;
        notFinded = true;
        if( subscribed.some(elem=> elem.dni === dni)){
            console.log('-----------El estudiante ya se encuentra inscrito.----------');
            return element;
        }else{
            subscribed.push({name: nameStud, dni: dni});
            element.subscribed = subscribed;
            return element;
        }
    });
    if(!notFinded){
        console.log('Curso con id '+selected+' no se a encontrado.');
        setTimeout(welcome,1000);
        return;
    }
    let updateString = JSON.stringify(update);
    fs.writeFile(FILE, updateString, function (err) {
        if (err) return console.log('Fallo la suscripción: '+err);
        console.log('Fin de la inscripción!');
        showCorse(selected,true);
    });
}

function welcome(){
    console.log('________________________________');
    console.log('Bienvenido a la primera entrega');
    console.log('');
    console.log('Por favor seleccionar alguna de las opciones:');
    console.log('');
    console.log('  1.Para mostrar los cursos disponibles y/o mostrar un curso en especifico con sus inscritos:');
    console.log('    comando "course", curso Id "-c=", mostrar inscritos "-s=1" opcionales ambos');
    console.log('  2.Para inscribir un estudiante a uno de los cursos:');
    console.log('    comando "inscribir" nombre "-n=", documento "-x=" y curso id "-i=" todos obligatorios');
    console.log('');
    console.log('Nota: Todos los comandos deben de ser precedidos por "node principal"');
}

main();