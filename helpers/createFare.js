function ongkos(destination) {
    let number = destination.length;
    if (this.ServiceId == 2) {
        return number * 5000
    } else if (this.ServiceId == 1) {
        return number * 10000
    }
}

module.exports = { ongkos }