
// https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=example
// https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=example

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDfN87vpZbXBjgI7_HGbNWfUnmk3A3Aef0",
    authDomain: "aset-bba22.firebaseapp.com",
    databaseURL: "https://aset-bba22-default-rtdb.firebaseio.com",
    projectId: "aset-bba22",
    storageBucket: "aset-bba22.appspot.com",
    messagingSenderId: "963377272845",
    appId: "1:963377272845:web:0f55ee05f61dc14885dd44"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const refLok = database.ref("Data").child("Lokasi");
const refAset = database.ref("Data").child("Aset");
listLokasi();

function listLokasi() {
    console.log("function tabelLokasi");

    // let optLok = "<option selected disabled>---Pilih Lokasi---</option>"

    let tblLok = "";

    refLok.on("value", function (snapshot) {
        if (snapshot.exists()) {
            console.log("snapshot exists");

            snapshot.forEach(function (snapshot2) {
                let nmLok = snapshot2.key;
                console.log(nmLok);

                // optLok += "<option>" + nmLok + "</option>";

                tblLok += "<tr>";
                tblLok += "<td><a href=\'#\' onclick=\"editLok(\'" + nmLok + "\')\">" + nmLok + "</a></td>";
                tblLok += "<td><button type=\'button\' onclick=\"hapus(\'" + nmLok + "\')\" class=\'btn btn-danger\'>Delete</button></td>";
                tblLok += "</tr>";
            });
        };

        // optLok += "<option>Lokasi Lainnya</option>";

        document.getElementById("rowRuang").innerHTML = tblLok;

        // document.getElementById("lokasiList").innerHTML = optLok;
    });
    return false;
};

// start function Bend. 29
function scanBend() {
    console.log("function scanBend");

    let kamera = "<video id=\'preview\' width=\'50%\' height=\'15%\'></video>";

    kamera += "<div class=\'btn-group btn-group-toggle mb-5\' data-toggle=\'buttons\'>";
    kamera += "<label class=\'btn btn-primary active\'>";
    kamera += "<input type=\'radio\' name=\'options\' value=\'1\' autocomplete=\'off\'' checked> Front Camera";
    kamera += "</label>";
    kamera += "<label class=\'btn btn-secondary\'>";
    kamera += "<input type=\'radio\' name=\'options\' value=\'2\' autocomplete=\'off\'> Back Camera";
    kamera += "</label>";
    kamera += "</div>";

    document.getElementById("kamera").innerHTML = kamera;

    let scanner = new Instascan.Scanner({ video: document.getElementById('preview'), mirror: false });
    scanner.addListener('scan', function (content) {
        document.getElementById("Notif-Body").innerHTML = "Hasil Scan : " + content;
        $("#Notif").modal("show");
        document.getElementById("kamera").innerHTML = "<button class=\'btn btn-danger btn-sm\'>" + content + "</button>";
        scanner.stop();
        return false;
    });

    Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 0) {
            console.log(cameras);
            scanner.start(cameras[0]);
            $("[name='options']").on('change', function () {
                if ($(this).val() == 1) {
                    console.log("kamera depan dipilih");
                    if (cameras[0] != "") {
                        console.log("ada kamera depan");
                        scanner.start([0]);
                    } else {
                        console.log("tdk ada kamera depan");
                        document.getElementById("Notif-Body").innerHTML = "Front Camera not found";
                        $("#Notif").modal("show");
                    };
                } else if ($(this).val() == 2) {
                    console.log("Kamera belakang dipilih");
                    if (cameras[1] != "") {
                        console.log("ada kamera belakang");
                        scanner.start([1]);
                    } else {
                        console.log("tdk ada kamera belakang");
                        document.getElementById("Notif-Body").innerHTML = "Back Camera not found";
                        $("#Notif").modal("show");
                    };
                };
            });



            // let selectedCam = cameras[0];
            // $.each(cameras, (i, c) => {
            //     if (c.name.indexOf('back') != -1) {
            //         selectedCam = c;
            //         return false;
            //     };
            // });
            // scanner.start(selectedCam);

        } else {
            console.error('no camera found');
        };
    }).catch(function (e) {
        console.error(e);
    });




    // refAset.orderByChild("Aset").limitToLast(1).once("value", function (snapX) {
    //     snapX.forEach(function (childSnapX) {
    //         let childKey = childSnapX.key;
    //         let childVal = childSnapX.val();
    //         console.log("childKey : " + childKey);
    //         console.log("childVal : " + childVal);
    //     });
    // });


};
// end function Bend. 29

// start function Lokasi
function simpan() {
    console.log("function simpan");
    var inpLokasi = document.getElementById("inpLokasi").value;
    if (inpLokasi == "") {
        console.log("input kosong");
        document.getElementById("Notif-Body").innerHTML = "Input Nama Lokasi Kosong!";
        $("#Notif").modal("show");
        return false;
    } else {
        console.log("input tdk kosong");
        refLok.child(inpLokasi).once("value", function (snapshot) {
            if (snapshot.exists()) {
                console.log("node ada");
                document.getElementById("inpLokasi").value = "";
                document.getElementById("Notif-Body").innerHTML = "Lokasi " + inpLokasi + " sdh ada!";
                $("#Notif").modal("show");
                return false;
            } else {
                console.log("node tdk ada");
                refLok.child(inpLokasi).set({
                    Nm_Lok: inpLokasi
                });
                listLokasi();
                document.getElementById("inpLokasi").value = "";
                document.getElementById("Notif-Body").innerHTML = "Lokasi " + inpLokasi + " berhasil disimpan";
                $("#Notif").modal("show");
                return false;
            };
        });
    };
};

function editLok(nmLok) {
    event.preventDefault();
    console.log("function editLok");
    console.log("nmLok: " + nmLok);
    document.getElementById("inpLokasi").value = nmLok;
    document.getElementById("hideLokasi").value = nmLok;
    document.getElementById("btnSimpan").style.display = "none";
    document.getElementById("btnUpdate").style.display = "block";
    return false;
};

function update() {
    console.log("function update");
    var txtLok = document.getElementById("inpLokasi").value;
    var hdLok = document.getElementById("hideLokasi").value;
    console.log("txtLok : " + txtLok);
    console.log("hdLok : " + hdLok);
    if (txtLok == hdLok) {
        console.log("sama");
        clearInp();
        document.getElementById("Notif-Body").innerHTML = "Tidak ada perubahan nama lokasi!";
        $("#Notif").modal("show");
        return false;
    } else {
        console.log("tdk sama");
        refLok.child(txtLok).once("value", function (snapshot) {
            if (snapshot.exists()) {
                console.log("update node akan menimpa data lain yang sama");
                document.getElementById("Notif-Body").innerHTML = "Nama Lokasi " + txtLok + " sdh ada di database. Coba nama lokasi lain.";
                $("#Notif").modal("show");
                document.getElementById("inpLokasi").value = hdLok;
                return false;
            } else {
                console.log("update node tdk akan menimpa data lain");
                refLok.child(hdLok).set(null);
                refLok.child(txtLok).set({
                    Nm_Lok: txtLok
                });
                listLokasi();
                document.getElementById("Notif-Body").innerHTML = "Nama lokasi berhasil dirubah!";
                $("#Notif").modal("show");
                clearInp();
                return false;
            };
        });
    };
};

function hapus(nmLok) {
    console.log("function delete");
    console.log(nmLok);
    document.getElementById("Konf-Body").innerHTML = "Anda yakin ingin menghapus data Lokasi " + nmLok + "?<input type=\'hidden\' id=\'idDel\'>";
    document.getElementById("idDel").value = nmLok;
    $("#Konf").modal("show");
    return false;
};

function doHapus() {
    console.log("function doHapus");
    var nmLok = document.getElementById("idDel").value;
    $("#Konf").modal("hide");
    refLok.child(nmLok).set(null);
    document.getElementById("Notif-Body").innerHTML = "Data Lokasi " + nmLok + " berhasil dihapus";
    $("#Notif").modal("show");
    listLokasi();
    return false;
};

function clearInp() {
    console.log("function clearInp");
    document.getElementById("inpLokasi").value = "";
    document.getElementById("hideLokasi").value = "";
    document.getElementById("btnSimpan").style.display = "block";
    document.getElementById("btnUpdate").style.display = "none";
};
// end function Lokasi

