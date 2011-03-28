/**
 * Echolot wait indicator.
 */
Echo.Client.DefaultWaitIndicator = Core.extend(Echo.Client.WaitIndicator, {

    _divElement: null,
    //_overlayDivElement: null,
    _textNode: null,
    _imgNode: null,
    _textPElement: null,

    /** Creates a new DefaultWaitIndicator. */
    $construct: function() {
        this._divElement = document.createElement("div");
        this._divElement.style.cssText = "z-index:32767;display: block;position:absolute;top:50%;left:50%;margin-left: -100px; margin-top: -50px;background-color: white;padding:10px;border:1px outset #abcdef; overflow:visible;text-align:center;-moz-box-shadow: 0 0 6px black";
        this._textPElement = document.createElement("p");
        this._textPElement.style.cssText = "font-size: 12px; color:#666";
        this._divElement.appendChild(this._textPElement);

        this._textNode = document.createTextNode("");
        this._textPElement.appendChild(this._textNode);

        this._imgNode = document.createElement("img");

        this._imgNode.src = "image/ajax-loader.gif";
        this._divElement.appendChild(this._imgNode);

        //this._fadeRunnable = new Core.Web.Scheduler.MethodRunnable(Core.method(this, this._tick), 50, true);

        // an cool overlay!
        // this._overlayDivElement = document.createElement("div");
        // this._overlayDivElement.style.cssText = "z-index:32766; display: block; height: 2856px;background: #666;left: 0px;opacity: 0.2; position: absolute;top: 0px;width: 100%;";
        // document.body.appendChild(this._overlayDivElement);

        document.body.appendChild(this._divElement);
    },

    /** @see Echo.Client.WaitIndicator#activate */
    activate: function(client) {
        /*
        if (client.configuration["WaitIndicator.Background"]) {
            this._divElement.style.backgroundColor = client.configuration["WaitIndicator.Background"];
            this._divElement.style.borderColor = client.configuration["WaitIndicator.Background"];
        }
        if (client.configuration["WaitIndicator.Foreground"]) {
            this._divElement.style.color = client.configuration["WaitIndicator.Foreground"];
        }
        */
        this._textNode.nodeValue = client.configuration["WaitIndicator.Text"];
        // this._overlayDivElement.style.display = "block";
        this._divElement.style.display = "block";
        this._opacity = 0;
    },

    /** @see Echo.Client.WaitIndicator#deactivate */
    deactivate: function(client) {
        // this._overlayDivElement.style.display = "none";
        this._divElement.style.display = "none";
    }

});