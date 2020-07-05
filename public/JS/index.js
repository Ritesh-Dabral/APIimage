function validateLimit(){
    var limit = document.getElementById('limit');

    if(isNaN(limit.value)){
        var setLimit = document.getElementById('setLimit');
        setLimit.innerText = "limit should only be a number (>=1)";
        setLimit.style.color='red';
        return false;
    }
    else if(Number(limit.value) < 1)
    {
        var setLimit = document.getElementById('setLimit');
        setLimit.innerText = "limit should be 1 or more";
        setLimit.style.color='red';
        return false;
    }
    return true;
}
