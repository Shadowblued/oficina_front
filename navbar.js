document.addEventListener('DOMContentLoaded', function() {

    const menuHTML = `
<nav class="navbar navbar-expand-lg navbar-light" style="background-color:DodgerBlue;">
    <div class="container-fluid">
        <a class="navbar-brand" href="#">Flávio do Pneu Estourado</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav" style="padding:0px 30px">
            <li class="nav-item" style="padding:0px 20px">
            <a class="nav-link active" aria-current="page" href="index.html">Ordem de Serviço</a>
            </li>
            <li class="nav-item" style="padding:0px 20px">
            <a class="nav-link active" href="#">Clientes</a>
            </li>
            <li class="nav-item" style="padding:0px 20px">
            <a class="nav-link active" href="#">Mecânicos</a>
            </li>
            <li class="nav-item" style="padding:0px 20px">
            <a class="nav-link active" href="#">Veículos</a>
            </li>
            <li class="nav-item" style="padding:0px 20px">
            <a class="nav-link active" href="#">Peças</a>
            </li>
            <li class="nav-item" style="padding:0px 20px">
            <a class="nav-link active" href="#">Serviços</a>
            </li>
        </ul>
        </div>
    </div>
</nav>
    `;

    document.getElementById('menu-container').innerHTML = menuHTML;

})