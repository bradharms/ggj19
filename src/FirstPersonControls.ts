// @ts-check
'use strict';

import { Vector3, Math as TMath, Spherical } from "three";

/**
 * @constructor
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author paulirish / http://paulirish.com/
 */
export default class FirstPersonControls {

    enabled = true;
    movementSpeed = 1.0;
    lookSpeed = 0.005;
    lookVertical = true;
    autoForward = false;
    activeLook = true;
    heightSpeed = false;
    heightCoef = 1.0;
    heightMin = 0.0;
    heightMax = 1.0;
    constrainVertical = false;
    verticalMin = 0;
    verticalMax = Math.PI;
    autoSpeedFactor = 0.0;
    mouseX = 0;
    mouseY = 0;
    lat = 0;
    lon = 0;
    moveForward = false;
    moveBackward = false;
    moveLeft = false;
    moveRight = false;
    moveUp = false;
    moveDown = false;
    mouseDragOn = false;
    viewHalfX = 0;
    viewHalfY = 0;

    constructor(
        public object: any,
        public domElement: Document | HTMLElement = document
    ) {
        if (!(this.domElement instanceof Document)) {
            this.domElement.setAttribute('tabindex', '-1');
        }

        this.domElement.addEventListener('contextmenu', this.contextmenu, false);
        this.domElement.addEventListener('mousemove', this.onMouseMove, false);
        this.domElement.addEventListener('mousedown', this.onMouseDown, false);
        this.domElement.addEventListener('mouseup', this.onMouseUp, false);
        window.addEventListener('keydown', this.onKeyDown, false);
        window.addEventListener('keyup', this.onKeyUp, false);
        this.handleResize();
    }

    handleResize = () => {
        if (this.domElement instanceof Document) {
            this.viewHalfX = window.innerWidth / 2;
            this.viewHalfY = window.innerHeight / 2;
        }
        else {
            this.viewHalfX = this.domElement.offsetWidth / 2;
            this.viewHalfY = this.domElement.offsetHeight / 2;
        }
    }

    onMouseDown = (event: MouseEvent) => {
        if (!(this.domElement instanceof Document)) {
            this.domElement.focus();
        }
        event.preventDefault();
        event.stopPropagation();
        if (this.activeLook) {
            switch (event.button) {
                case 0:
                    this.moveForward = true;
                    break;
                case 2:
                    this.moveBackward = true;
                    break;
            }
        }
        this.mouseDragOn = true;
    }

    onMouseUp = (event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        if (this.activeLook) {
            switch (event.button) {
                case 0:
                    this.moveForward = false;
                    break;
                case 2:
                    this.moveBackward = false;
                    break;
            }
        }
        this.mouseDragOn = false;
    }

    onMouseMove = (event: MouseEvent) => {
        if (this.domElement instanceof Document) {
            this.mouseX = event.pageX - this.viewHalfX;
            this.mouseY = event.pageY - this.viewHalfY;
        }
        else {
            this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
            this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;
        }
    }

    onKeyDown = (event: KeyboardEvent) => {
        //event.preventDefault();
        switch (event.keyCode) {
            case 38: /*up*/
            case 87: /*W*/
                this.moveForward = true;
                break;
            case 37: /*left*/
            case 65: /*A*/
                this.moveLeft = true;
                break;
            case 40: /*down*/
            case 83: /*S*/
                this.moveBackward = true;
                break;
            case 39: /*right*/
            case 68: /*D*/
                this.moveRight = true;
                break;
            case 82: /*R*/
                this.moveUp = true;
                break;
            case 70: /*F*/
                this.moveDown = true;
                break;
        }
    }

    onKeyUp = (event: KeyboardEvent) => {
        switch (event.keyCode) {
            case 38: /*up*/
            case 87: /*W*/
                this.moveForward = false;
                break;
            case 37: /*left*/
            case 65: /*A*/
                this.moveLeft = false;
                break;
            case 40: /*down*/
            case 83: /*S*/
                this.moveBackward = false;
                break;
            case 39: /*right*/
            case 68: /*D*/
                this.moveRight = false;
                break;
            case 82: /*R*/
                this.moveUp = false;
                break;
            case 70: /*F*/
                this.moveDown = false;
                break;
        }
    }

    update = () => {
        var targetPosition = new Vector3();
        return (delta: number) => {
            if (this.enabled === false)
                return;
            if (this.heightSpeed) {
                var y = TMath.clamp(this.object.position.y, this.heightMin, this.heightMax);
                var heightDelta = y - this.heightMin;
                this.autoSpeedFactor = delta * (heightDelta * this.heightCoef);
            }
            else {
                this.autoSpeedFactor = 0.0;
            }
            var actualMoveSpeed = delta * this.movementSpeed;
            if (this.moveForward || (this.autoForward && !this.moveBackward))
                this.object.translateZ(-(actualMoveSpeed + this.autoSpeedFactor));
            if (this.moveBackward)
                this.object.translateZ(actualMoveSpeed);
            if (this.moveLeft)
                this.object.translateX(-actualMoveSpeed);
            if (this.moveRight)
                this.object.translateX(actualMoveSpeed);
            if (this.moveUp)
                this.object.translateY(actualMoveSpeed);
            if (this.moveDown)
                this.object.translateY(-actualMoveSpeed);
            var actualLookSpeed = delta * this.lookSpeed;
            if (!this.activeLook) {
                actualLookSpeed = 0;
            }
            var verticalLookRatio = 1;
            if (this.constrainVertical) {
                verticalLookRatio = Math.PI / (this.verticalMax - this.verticalMin);
            }
            this.lon -= this.mouseX * actualLookSpeed;
            if (this.lookVertical)
                this.lat -= this.mouseY * actualLookSpeed * verticalLookRatio;
            this.lat = Math.max(-85, Math.min(85, this.lat));
            var phi = TMath.degToRad(90 - this.lat);
            var theta = TMath.degToRad(this.lon);
            if (this.constrainVertical) {
                phi = TMath.mapLinear(phi, 0, Math.PI, this.verticalMin, this.verticalMax);
            }
            var position = this.object.position;
            targetPosition.setFromSpherical(new Spherical(1, phi, theta))
                .add(position);
            this.object.lookAt(targetPosition);
        };
    }

    contextmenu = (event) => {
        event.preventDefault();
    }

    dispose = () => {
        this.domElement.removeEventListener('contextmenu', this.contextmenu, false);
        this.domElement.removeEventListener('mousedown', this.onMouseDown, false);
        this.domElement.removeEventListener('mousemove', this.onMouseMove, false);
        this.domElement.removeEventListener('mouseup', this.onMouseUp, false);
        window.removeEventListener('keydown', this.onKeyDown, false);
        window.removeEventListener('keyup', this.onKeyUp, false);
    }
}
