export function mouseX(evt: any) {
  if (evt.pageX) {
    return evt.pageX;
  } else if (evt.clientX) {
    return (
      evt.clientX +
      (document.documentElement.scrollLeft || document.body.scrollLeft)
    );
  } else {
    return null;
  }
}

export function mouseY(evt: any) {
  if (evt.pageY) {
    return evt.pageY;
  } else if (evt.clientY) {
    return (
      evt.clientY +
      (document.documentElement.scrollTop || document.body.scrollTop)
    );
  } else {
    return null;
  }
}
