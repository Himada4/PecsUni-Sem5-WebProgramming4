<div class="backgroundContainer">
    <div class="backgroundSolidTop"></div>
    <div class="backgroundSolidBottom"></div>
</div>

<style>
    .backgroundContainer {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        z-index: -1;
        display: flex;
        flex-direction: column;
    }

    .backgroundSolidTop {
        height: 10rem;
        width: 100%;
        background-color: #cc886d;

    }

    .backgroundSolidBottom {
        flex-grow: 1;
        width: 100%;
        background-color: #90c1da;
    }
</style>
