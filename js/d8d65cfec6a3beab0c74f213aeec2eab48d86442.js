$(document).ready(function()
{
    //GetCardApi();
    //GetCards();
});


function GetCardUrl(name)
{ 
    return new CardsAPI().getImageURL(name);
}
/*
function GetCardApi()
{
    $.getJSON("/data/card-api.json", function(data)
    {
        cardApi = data;
    });
}
function GetCardImageUrlByCardName(name)
{
    var urlKonami = "https://www.konami.com/yugioh/duel_links/en/box/cards/en/{id}.jpg";
    var urlStudio = "https://static-3.studiobebop.net/ygo_data/card_images/{name}.jpg";
    var urlYgoHub = "https://www.ygohub.com/api/card_info?name={name}";
    
    var idResult = GetDuelLinksIdByCardName(name);

    if(idResult !== false)
    {
        var url = urlKonami.replace("{id}", idResult);

        UrlExists(url, function(success)
        {
            if (success) { alert(name + ': Yay!'); }
            else { alert(name + ': Oh no!'); }
        });

        if(UrlExists(url))
            alert("yay");
        else
            alert("aww");
    }
    else
    {
        return "404";
    }
}

function GetDuelLinksIdByCardName(name)
{
    var result = $(allCards).filter(function(index, value)
    {
        return value.name === name;
    });

    if($(result).length >= 1)
    {
        return $(result)[0].id;
    }
    else
    {
        return false;
    }
}

function UrlExists(url)
{
    $("#card-test").attr("src", url);

    setTimeout(function()
    {
        return $("#card-test").width() !== 0;
    }, 2000);
    
    
    $.ajax(
    {
        type: 'HEAD',
        dataType: "image/jpeg",
        url: url,
        success: function() { callback(true); },
        error: function() { callback(false); }
    });
}*/;
var startingPoint;
var pressingCarousel = false;

function touchedCarousel( event ) {
    pressingCarousel = true;
    switch(event.type) {
        case "touchstart":
            startingPoint = event.touches[0].pageX;
            break;
        case "mousedown":
            startingPoint = event.pageX;
            break;
    }
}

function releasedCarousel() {
    pressingCarousel = false;  
}

function swipingCarousel( event ) {
    if(pressingCarousel) {  
        var endingPoint;       
        switch(event.type) {
            case "touchmove":
                endingPoint = event.touches[0].pageX;
                break;
            case "mousemove":
                endingPoint = event.pageX;
                break;
        }

        if(endingPoint) {
            var difference = endingPoint - startingPoint;
            if( Math.abs(difference) >= 20 ) { // 20 pixel difference 
                if( difference > 0 ) {
                    $(this).carousel('prev');
                    pressingCarousel = false;
                }
                else {
                    $(this).carousel('next');
                    pressingCarousel = false;
                } 
            }
        }
    }    
}

$('.carousel').mousedown(touchedCarousel);
$('.carousel').mousemove(swipingCarousel);
$('.carousel').mouseup(releasedCarousel);

$('.carousel').on('touchstart', touchedCarousel);
$('.carousel').on('touchmove', swipingCarousel);
$('.carousel').on('touchend', releasedCarousel);;
// Note: This file has been modified for purpose of this site.   

/*
 * TouchScroll - using dom overflow:scroll
 * by kmturley
 */

/* globals window, document */

var TouchScroll = function () {
    'use strict';
    
    var module = {
        axis: 'x',
        drag: false,
        zoom: 1,
        time: 0.04,
        isIE: window.navigator.userAgent.toLowerCase().indexOf('msie') > -1,
        isFirefox: window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1,
        /**
         * @method init
         */
        init: function (options) {
            var me = this;
            this.options = options;
            
            this.el = options.el;

            // if draggable option is enabled add events
            if (options.draggable === true) {
                if (this.isIE) {
                    document.ondragstart = function () { return false; };
                }
                if (this.isIE || this.isFirefox) {
                    this.body = document.documentElement;
                } else {
                    this.body = document.body;
                }
                this.addEvent('mousedown', this.el, function (e) { me.onMouseDown(e); });
                this.addEvent('mousemove', this.el, function (e) { me.onMouseMove(e); });
                this.addEvent('mouseup', this.body, function (e) { me.onMouseUp(e); });
            }
            
            // if zoom option exists add mouse wheel functionality to element
            if (options && options.zoom) {
                this.elzoom = document.getElementById(options.zoom);
                if (this.isFirefox) {
                    this.addEvent('DOMMouseScroll', this.el, function (e) { me.onMouseWheel(e); });
                } else {
                    this.addEvent('mousewheel', this.el, function (e) { me.onMouseWheel(e); });
                }
            }
            
            // if scroll options exist add events
            if (options && options.prev) {
                this.prev = document.getElementById(options.prev);
                this.addEvent('mousedown', this.prev, function (e) {
                    me.onMouseDown(e);
                });
                this.addEvent('mouseup', this.prev, function (e) {
                    me.diffx = options.distance ? (-options.distance / 11) : -11;
                    me.onMouseUp(e);
                });
            }
            if (options && options.next) {
                this.next = document.getElementById(options.next);
                this.addEvent('mousedown', this.next, function (e) {
                    me.onMouseDown(e);
                });
                this.addEvent('mouseup', this.next, function (e) {
                    me.diffx = options.distance ? (options.distance / 11) : 11;
                    me.onMouseUp(e);
                });
            }
        },
        /**
         * @method addEvent
         */
        addEvent: function (name, el, func) {
            if (el.addEventListener) {
                el.addEventListener(name, func, false);
            } else if (el.attachEvent) {
                el.attachEvent('on' + name, func);
            } else {
                el[name] = func;
            }
        },
        /**
         * @method cancelEvent
         */
        cancelEvent: function (e) {
            if (!e) { e = window.event; }
            if (e.target && e.target.nodeName === 'IMG') {
                e.preventDefault();
            } else if (e.srcElement && e.srcElement.nodeName === 'IMG') {
                e.returnValue = false;
            }
        },
        /**
         * @method onMouseDown
         */
        onMouseDown: function (e) {
            if (this.drag === false || this.options.wait === false) {
                this.drag = true;
                this.cancelEvent(e);
                this.startx = e.clientX + this.el.scrollLeft;
                this.starty = e.clientY + this.el.scrollTop;
                this.diffx = 0;
                this.diffy = 0;
            }
        },
        /**
         * @method onMouseMove
         */
        onMouseMove: function (e) {
            if (this.drag === true) {
                this.cancelEvent(e);
                this.diffx = (this.startx - (e.clientX + this.el.scrollLeft));
                this.diffy = (this.starty - (e.clientY + this.el.scrollTop));
                this.el.scrollLeft += this.diffx;
                this.el.scrollTop += this.diffy;
            }
        },
        /**
         * @method onMouseMove
         */
        onMouseUp: function (e) {
            if (this.drag === true) {
                if (!this.options.wait) {
                    this.drag = null;
                }
                this.cancelEvent(e);
                var me = this,
                    start = 1,
                    animate = function () {
                        //var step = Math.sin(start);
                        var step = Math.pow(Math.E, -Math.pow(start - 1, 2)); // Gaussian Function shifted 1 unit to the right
                        if (step <= 0) {
                            me.diffx = 0;
                            me.diffy = 0;
                            window.cancelAnimationFrame(animate);
                            me.drag = false;
                        } else {
                            me.el.scrollLeft += me.diffx * step;
                            me.el.scrollTop += me.diffy * step;
                            start -= me.time;
                            window.requestAnimationFrame(animate);
                        }
                    };
                animate();
            }
        },
        /**
         * @method onMouseMove
         */
        onMouseWheel: function (e) {
            this.cancelEvent(e);
            if (e.detail) {
                this.zoom -= e.detail;
            } else {
                this.zoom += (e.wheelDelta / 1200);
            }
            if (this.zoom < 1) {
                this.zoom = 1;
            } else if (this.zoom > 10) {
                this.zoom = 10;
            }
            /*
            this.elzoom.style.OTransform = 'scale(' + this.zoom + ', ' + this.zoom + ')';
            this.elzoom.style.MozTransform = 'scale(' + this.zoom + ', ' + this.zoom + ')';
            this.elzoom.style.msTransform = 'scale(' + this.zoom + ', ' + this.zoom + ')';
            this.elzoom.style.WebkitTransform = 'scale(' + this.zoom + ', ' + this.zoom + ')';
            this.elzoom.style.transform = 'scale(' + this.zoom + ', ' + this.zoom + ')';
            */
            this.elzoom.style.zoom = this.zoom * 100 + '%';
            //this.el.scrollLeft += e.wheelDelta / 10;
            //this.el.scrollTop += e.wheelDelta / 8;
        }
    };
    return module;
};

$(function(){
    var imageSliders = $('.image-slider');
    imageSliders.each(function(index, imageSlider) {
        var slider = new TouchScroll();
        slider.init({
            el: $(imageSlider)[0],
            draggable: true,
            wait: false
        });
    });    
});;
// TODO: Rename this since the skill API is added? 

/* 
 * This API is used to access a card's data
 */
function CardsAPI()
{
    // TODO: Rename this since the skill API is added? 

    /*
     * This function searches a given card name and returns its information
     * using the Card object.  
     * 
     * @param cardName The name of the card to search
     * @param callback Function to execute once the data is retrieved
     * @param callbackParameters (optional) Parameters to pass back with the callback function
     * 
     * @return Card An object containing the information, if available (if not, the 
     *              object will be null)
     * 
     * Card - This is object is used to store the data retrieved from a card search    
     *  
     * name The name of the card 
     * rarity A card's rarity value (i.e. 'N' for Normal, 'UR' for Ultra Rare, etc.)
     * attribute A card's attribute value (i.e. 'Wind', 'Light', etc.)
     * level The amount of stars a card has (only applies to monster type cards)
     * materials The monsters needed to summon this card (fusion materials)
     * description The description of the card
     * type A card's type (i.e. 'Spell', 'Trap', "Winged Beast", etc.)
     * attack A card's attack points (only applies to monsters)
     * defense A card's defense points (only applies to monsters)
     * obtain How/where to obtain this card within the game (if not available, 
     *        the phrase 'Needs to be Added' will be placed inside); in addition,
     *        this value is an array, so if more than one location is available, it
     *        will be inserted   
     */  
    this.search = function(cardName, callback, callbackParameters)
    {
        let cardobtain = new Promise(function(resolve) {
            Promise.all([getGlobalObtainJson()]).then(function(response) {
                let filteredCards = [];
                $(response[0]).each(function(index, card) {
                    if(card.name == cardName)
                    {
                        filteredCards.push(card);
                    }
                });
                resolve(filteredCards);
            });
        });

        let cardinfo = JSON.parse(sessionStorage.getItem(cardName));
        
        const cardNameEncoded = encodeURIComponent(cardName);

        if (!cardinfo)
        {
            cardinfo = new Promise(function(resolve) {
                Promise.all([cardDataFilterPromise]).then(function(response) {
                    cardDataFilter = response[0];
                    const exclusiveData = cardDataFilter.find(card => card.name === cardName );
                    if (exclusiveData)
                    {
                        resolve(exclusiveData);
                    }
                    else
                    {
                        Promise.all([$.getJSON("https://db.ygoprodeck.com/api/v4/cardinfo.php?name=" + cardNameEncoded)]).then(function(r)
                        {
                            sessionStorage.setItem(cardName, JSON.stringify(r));
                            resolve(r);
                        }).catch(function(error) {
                            // This can happen if a wrong name if given to the card search, so return null
                            callback(null);
                        });
                    }
                });
            });
        }
        
        const self = this;
        Promise.all([cardobtain, cardinfo]).then(function(response)
        {
            let card = new Object();
 
            self.obtainCardData = response[1];
            if(!response[1].name) self.obtainCardData = response[1][0][0][0];
            self.obtainCardName = cardName;

            card.name = cardName;
            card.rarity = response[0].length > 0 ? response[0][0].rarity : "";
            card.attribute = self.obtainCardProperty("attribute") != null ? self.obtainCardProperty("attribute") : "";

            if (self.obtainCardProperty('type') && !self.obtainCardProperty('type').includes("Pendulum") &&
                (self.obtainCardProperty('type').includes("Fusion") ||
                self.obtainCardProperty('type').includes("Synchro") ||
                self.obtainCardProperty('type').includes("XYZ") ||
                self.obtainCardProperty('type').includes("Link")))
            {
                const cardTextArray = self.obtainCardProperty("desc").split("\n");
                card.materials = cardTextArray.splice(0, 1)[0];
                const joinedDesc = cardTextArray.join(" ");
                card.description = (joinedDesc ? joinedDesc : "");
            }
            else
            {
                card.description = self.obtainCardProperty("desc");
                card.materials = "";
            }

            if (self.obtainCardProperty('type').includes("Fusion"))
            {
                card.isFusionMonster = true;
            }
            if (self.obtainCardProperty('type').includes("Synchro"))
            {
                card.isSynchroMonster = true;
            }
            if (self.obtainCardProperty('type').includes("XYZ"))
            {
                card.isXyzMonster = true;
            }
            if (self.obtainCardProperty('type').includes("Link"))
            {
                card.isLinkMonster = true;
            }

            // Pendulums need special treatment, the above filter does not work on them
            if (self.obtainCardProperty('type').includes("Pendulum"))
            {
                card.isPendulumMonster = true;
                card.description = (card.description.replace('[ Pendulum Effect ]','<b>[</b> Pendulum Effect <b>]</b>'));
                card.description = (card.description.replace('[ Monster Effect ]','<p class="pendulumPadding"></p><b>[</b> Monster Effect <b>]</b>'));
                card.description = (card.description.replace('[ Flavor Text ]','<p class="pendulumPadding"></p><b>[</b> Flavor Text <b>]</b>'));

                if (self.obtainCardProperty('type').includes("Pendulum") &&
                    (self.obtainCardProperty('type').includes("XYZ") || 
                    self.obtainCardProperty('type').includes("Synchro") || 
                    self.obtainCardProperty('type').includes("Fusion") ))
                {
                    card.isComplexPendulumMonster = true;

                    // Splitting the effect between pendulum and regular. Materials are in the regular effect section.
                    splitCriteria = / Monster Effect /;
					result = card.description.search(splitCriteria);
                    const preComplexPendulumSplit = [card.description.slice(0, result), card.description.slice(result + 26)];

                    splitCriteria = /\r/;
                    result = preComplexPendulumSplit[1].search(splitCriteria);
                    const postComplexPendulumSplit = [preComplexPendulumSplit[1].slice(0,result), preComplexPendulumSplit[1].slice(result)];

                    card.description = (card.description.replace(postComplexPendulumSplit[0],''));
                    card.materials = postComplexPendulumSplit[0]
                }

                card.description = (card.description.replace("----------------------------------------", ""));
            }

            if (card.isLinkMonster)
            {
                card.level = "";
            }
            else
            {
                card.level = self.obtainCardProperty("level") != null ? self.obtainCardProperty("level") : "";
			}
            
            const cardType = self.obtainCardProperty("type").replace("XYZ", "Xyz").split(" ");
            if (cardType.pop() == "Monster")
            {
                card.type = self.obtainCardProperty("race") + " / " + cardType.join(" / ");
            }
            else
            {
                card.type = self.obtainCardProperty("type").split(" ")[0] + " / " + self.obtainCardProperty("race");
            }

            card.attack = self.obtainCardProperty("atk") != null ? self.obtainCardProperty("atk") : "";
            card.defense = self.obtainCardProperty("def") != null ? self.obtainCardProperty("def") : "";

            card.obtain = (response[0].length == 0 ? ["Currently unavailable"] : response[0][0].how);

            callback(card, callbackParameters);
        }).catch(function(error) {
            // This can happen if a wrong name if given to the card search, so return null
            callback(null);
        });
    },

    /*
     * This function is used to search for a skill, returning the findings 
     * through a callback function. 
     * 
     * @param skillName - The name of the skill to be searched
     * @param callback - The function to return the data, once searched
     * 
     * @return Skill - Object containing the information of the skill; if 
     *                 not found, null is returned 
     * 
     * Skill - This object contains a list of parameters for a skill
     * 
     * name - Name of the skill
     * description - Description of the skill  
     * exclusive - Whether or not this skill is exclusive to a character (true/false)
     * character - If the skill is exclusive, then this will be the name of the that character (else, empty string) 
     * imageURL - URL to obtain the image of the skill, depending on its exclusivity
     */ 
    this.searchSkill = async function(skillName, callback)
    {
        if(skills != undefined) {
            this.continueSearchSkill(skillName, callback)
        }
        else {
            await sleep(500);
            this.searchSkill(skillName, callback);
        }
    },

    /*
     * Continues to search for a skill within the returned 'skills' data
     * 
     * @param skillName Name of the skill
     * @param callback Function to call with the returned image URL
     * 
     * (Note: This function should be treated as private)
     */ 
    this.continueSearchSkill = function(skillName, callback) {
        let skill = new Object();
        for (let i = 0; i < skills.length; i++)
        {
            if (skills[i].name.replace(/[^a-zA-ZÎ±-Ï‰Î‘-Î© ]/g, "").toLowerCase() == skillName.replace(/[^a-zA-ZÎ±-Ï‰Î‘-Î© ]/g, "").toLowerCase())
            {
                skill.name = skills[i].name;
                skill.description = skills[i].description;
                skill.exclusive = skills[i].exclusive;
                skill.characters = skills[i].characters;                       

                break;
            }
        }
        
        if (!skill.name)
        {
            callback(null);
            return;
        }
        else
        {
            let characterId = "";

            if(skill.exclusive)
            {
                const matchingCharacters = characters.filter(function(character)
                {
                    return character.name === skill.characters[0].name;
                });

                characterId = matchingCharacters.length >= 0 ? matchingCharacters[0].id : "vagabond";
            }
            else
            {
                characterId = "vagabond";
            }

            skill.imageURL = getWebsiteLink() + `/img/characters/${characterId}/portrait.png`;
            callback(skill);
        };
    },

    /*
     * This function returns a URL to obtain an image from, given a 
     * card name. 
     * 
     * @param cardName Name of the card
     * @param portrait True if the image should just be of the card art,
     *                  false for the whole card
     * 
     * @return String URL of the image
     */
    this.getImageURL = function(cardName, portrait = false, callback = null)
    {
        if(callback) {
            this.checkForImageJsonData(cardName, portrait, callback);
        }
        else {
            return this.returnImageURL(cardName, portrait);
        }
    },

    /*
     * Uses the 'cardImageFilter' object to search for card images, if the
     * card isn't found, it searches URL points
     * 
     * @param cardName Name of the card
     * @param portrait True if the image should just be of the card art,
     *                  false for the whole card
     * @param callback Function to call with the returned image URL
     */
    this.returnImageURL = function(cardName, portrait, callback = null) {
        cardName = cardName.toLowerCase();
        for (let i = 0; i < (typeof cardImageFilter === 'undefined' ? [] : cardImageFilter).length; i++)
        {
            if (cardImageFilter[i].name.toLowerCase() == cardName)
            {
                let imageURL;
                if (cardImageFilter[i].hasOwnProperty('customURL'))
                {
                    imageURL = (portrait ? "https://images.weserv.nl/?url=https://www.duellinksmeta.com" : "") + cardImageFilter[i].customURL + (portrait ? '&il&crop=70,70,15,30&w=100' : '');
                }
                else if (cardImageFilter[i].hasOwnProperty('ID'))
                {
                    imageURL = "https://images.weserv.nl/?url=https://www.konami.com/yugioh/duel_links/en/box/cards/en/" + cardImageFilter[i].ID + ".jpg" + (portrait ? '&crop=70,70,15,30&w=100' : '&il&w=360&h=523&t=absolute');
                }

                return imageURL;
            }
        }

        nonFilterCard = nonFilterCards.find(function(card) { return card.nameSearch == cardName });
        if (nonFilterCard)
        {
            return "https://images.weserv.nl/?url=storage.googleapis.com/ygoprodeck.com/pics/" + nonFilterCard.ID + ".jpg" + (portrait ? '&crop=70,70,15,30&w=100' : '&il&w=360&h=523&t=absolute');
        }

        return (portrait ? "https://images.weserv.nl/?url=https://www.duellinksmeta.com" : "") + "/img/assets/missing-card.jpg" + (portrait ? '&il&crop=70,70,15,30&w=100' : '');
    },

    /*
     * Continually loops until all JSON objects are found,
     * then returns an image URL
     * 
     * @param cardName Name of the card
     * @param portrait True if the image should just be of the card art,
     *                  false for the whole card
     * @param callback Function to call with the returned image URL
     * 
     * (Note: This function should be treated as private)
     */ 
    this.checkForImageJsonData = async function(cardName, portrait, callback) {
        if(cardImageFilter != undefined && nonFilterCards != undefined) {
            callback(this.returnImageURL(cardName, portrait, callback));
        }
        else {
            await sleep(500);
            this.checkForImageJsonData(cardName, portrait, callback);
        }
    },

    /*
     * Used in the 'obtainCardProperty' method for the returned card 
     * data from the API 
     * 
     * (Note: This object should be treated as private)
     */ 
    this.obtainCardData = [],

    /*
     * This object is used by the 'obtainCardProperty' as the card 
     * searched against for the filter 
     * 
     * (Note: This object should be treated as private)
     */ 
    this.obtainCardName = "",

    /*
     * This method returns the asked property of a card, whether it was
     * derived from the given data array or a custom array of data for 
     * that card 
     * 
     * (Note: This method should be treated as private, as it needs the
     * returned card data to function)   
     * 
     * @param property String representation of the property asked 
     */ 
    this.obtainCardProperty = function(property)
    {
        let self = this;
        let cardProperty; 
        $(cardDataFilter).each(function(index, card)
        {
            if (self.obtainCardName == card.name)
            {
                cardProperty = card[property];
                return false;
            }
        });

        if (cardProperty)
        {
            return cardProperty;
        }
        else if (typeof this.obtainCardData !== "undefined")
        {
            return this.obtainCardData[property];
        }
        else
        {
            return "";
        }
    }
};

let cardImageFilter, nonFilterCards, cardDataFilter, cardDataFilterPromise, characters, skills;
$(document).ready(function()
{
    $.getJSON("/data/cardImageFilter.json", function(data)
    {
        cardImageFilter = data;
    });

    $.getJSON("/data/nonFilterCards.json", function(data)
    {
        nonFilterCards = data;
    });

    cardDataFilterPromise = $.getJSON("/data/exclusiveCards.json");

    $.getJSON("/data/characters.json", function(data)
    {
        characters = data;
    });

    $.getJSON("/data/skills.json", function(data)
    {
        skills = data;
    });
});;
(function(e)
{
    var shareData =
    {
        shareUrl: window.location.href,
        shareTitle: $("main header h1").text(),
        buttons: null
    };

    !function()
    {
        function setButtons()
        {
            shareData.buttons = e(".share-button")
        }

        function addSocialShareEvents()
        {
            shareData.buttons.on("click", function(e)
            {
                openShareWindow(e)
            })
        }

        function getWindowLocation(popupWidth, popupHeight)
        {
            let windowWidth  = window.innerWidth;
            let windowHeight = window.innerHeight;
            return { left: (windowWidth-popupWidth)/2, top: (windowHeight-popupHeight)/2 };
        }

        function openShareWindow(n)
        {
            var website; var w; var h; var loc;
            switch (n.target.dataset.shareSite)
            {
                case "reddit":
                    website = "Reddit",
                    w=770, h=520,
                    loc = getWindowLocation(w, h),
                    window.open("https://www.reddit.com/r/DuelLinks/submit?url=" + encodeURIComponent(shareData.shareUrl) + "&title=" + encodeURIComponent(shareData.shareTitle), "", "toolbar=no, status=0, width=" + w + ", height=" + h + ", left=" + loc.left + ", top=" + loc.top);
                    break;
                case "twitter":
                    website = "Twitter",
                    w=650, h=360,
                    loc = getWindowLocation(w, h),
                    window.open("//twitter.com/intent/tweet?text=" + encodeURIComponent(shareData.shareTitle) + "&url=" + encodeURIComponent(shareData.shareUrl) + "&related=DuelLinksMeta", "", "toolbar=no, status=0, width=" + w + ", height=" + h + ", left=" + loc.left + ", top=" + loc.top);
                    break;
                case "facebook":
                    website = "Facebook",
                    w=770, h=520,
                    loc = getWindowLocation(w, h),
                    window.open("//www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(shareData.shareUrl) + "&t=" + encodeURIComponent(shareData.shareTitle), "", "toolbar=no, status=0, width=" + w + ", height=" + h + ", left=" + loc.left + ", top=" + loc.top);
                    break;
            }
        }

        setButtons(),
        addSocialShareEvents()
    }()
}(jQuery));

class DiscordApi
{
    static get Url() { return "https://discordapp.com/api/v6"; }

    /* Straight passthrough methods */
    static GetUserDataByAccessToken(accessToken, callback)
    {
        return MakeAjaxCall(
        {
            type: "GET",
            url: DiscordApi.Url + "/users/@me",
            headers: { "Authorization": "Bearer " + accessToken },
            callback: callback
        });
    }

    static GetUserDataOnServer(userId, serverId, botToken, callback)
    {
        return MakeAjaxCall(
        {
            url: "/.netlify/functions/GetUserDataOnServer?userid="+ userId,
            callback: callback
        });
    }

    static GetServerMembers(userId, serverId, botToken, callback)
    {
        //not used right now?
        return MakeAjaxCall(
        {
            url: DiscordApi.Url + "/guilds/" + serverId + "/members?limit=1000",
            headers: { "Authorization": "Bot " + botToken },
            callback: callback
        });
    }

    static GetServerRoles(serverId, botToken, callback)
    {
        return MakeAjaxCall(
        {
            url: "/.netlify/functions/GetServerRoles",
            callback: callback
        });
    }
    /* ---------------------------- */

    /* -- Custom implementations -- */
    static GetIsUserMemberOnServer(userId, serverId, botToken, callback)
    {
        return DiscordApi.GetUserDataOnServer(userId, serverId, botToken, function(userData)
        {
            callback({success: true, userIsMember: true, userData: userData});
        },
        function(jqXHR, textStatus, errorThrown)
        {
            if(jqXHR && jqXHR.responseJSON && jqXHR.responseJSON.code == 10013) //Unknown User
                callback({success: true, userIsMember: false});
            else
                callback({success: false, jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown});
        });
    }
    /* -- Custom implementations -- */
}

function MakeAjaxCall(config)
{
    var ajaxOptions =
    {
        type: config.type,
        url: config.url,
        headers: config.headers,
        success: function (response)
        {
            if (typeof config.callback === "function")
            {
                config.callback(typeof response === "string" ? JSON.parse(response) : response);
            }
        },
        error: function(jqXHR, textStatus, errorThrown)
        {
            if(jqXHR && jqXHR.responseJSON)
                console.error(jqXHR.responseJSON.message);
            else
                console.error("Error with discord api");
        }
    }

    if(config.errorCallback && typeof config.errorCallback === "function")
        ajaxOptions.error = function(jqXHR, textStatus, errorThrown) { config.errorCallback(); }

    $.ajax(ajaxOptions);
};
;
$(document).ready(function()
{
    ExecuteOnReadyFunctions();
    BindPageEvents();
    BindContentEvents();
    initHideNavbar();
    cloneTocIntoSidebar();
});

function ExecuteOnReadyFunctions()
{
    ReadUrlHashFragment();
}

function BindPageEvents()
{
    BindTabsToUrlHash();
}

function BindContentEvents()
{
    BindCollapsableTables();

    $(".carousel").carousel(
    {
        interval: false
    });

    $(".select2").select2(
    {
        width: "100%",
        templateSelection: formatSelect2,
        allowHtml: true
    });
}

function formatSelect2(option)
{
    let icon = $(option.element).closest("select").data("icon");
    let optionHtml = "<span class='" + (option.disabled ? "unselected" : "") + "'>" + option.text + "</span>";

    if(typeof icon !== "undefined")
        return $("<span><i class='fa " + icon + "'></i>" + optionHtml + "</span>");
    else
        return optionHtml;
}

function ReadUrlHashFragment()
{
    var hash = window.location.hash;

    if (hash !== "")
    {
        $.when($(".nav-tabs a[href='" + hash + "']").tab("show")).then(function()
        {
            $("body, html").scrollTop(0);
        });

        /*$(".nav-tabs a[href='" + hash + "']").tab("show");
            $("#page-wrapper").scrollTop(0);*/
    }
}

function BindTabsToUrlHash()
{
  $(document).on("shown.bs.tab", "a[data-toggle='tab']", function(event)
  {
    var position = $("body, html").scrollTop();
    window.location.hash = event.target.hash;
    $("body, html").scrollTop(position);
  });
}

function BindCollapsableTables()
{
  $("table.collapsable").each(function(index, elem)
  {
    $(elem).find("thead").click(function()
    {
      $(elem).toggleClass("collapsed");
    });
  });
}

function EventComplete()
{
  $(".soon-event-countdown").addClass("hidden");
  $(".soon-event-complete").removeClass("hidden");
}

function getWebsiteLink()
{
  var websiteLink = location.protocol + "//" + location.hostname;
  
  if (location.port)
  {
    websiteLink += ":" + location.port;
  }

  return websiteLink;
}

function toKebabCase(string)
{
    return string
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map(x => x.toLowerCase())
        .join('-');
}

//menubutton script
function toggleMenuAnimation(elem)
{
  $("> .containernavbutton", elem).toggleClass("change");
}

function twitchNotification()
{
  //test if user has already seen this here

  // Get the snackbar DIV
  var x = document.getElementById("snackbar");

  if (x)
  {
    // Add the "show" class to DIV
    x.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function()
    {
      x.className = x.className.replace("show", "");
    }, 7000);
  }
}

//show twitch notification 3x
if (!sessionStorage.twitchCounter || sessionStorage.twitchCounter < 2)
{

  $.getJSON("https://api.twitch.tv/kraken/streams/duellinksmeta?client_id=ajtf58zc6vxrkaf7faohw5al9v3tua", function(channel)
  {
    if (channel["stream"] == null)
    {return;}
    else
    {
      twitchNotification();
      if (!sessionStorage.twitchCounter)
        {sessionStorage.twitchCounter = 1;}
      else
        {sessionStorage.twitchCounter++;}
    }
  });
}
/*(function($)
{
     $.extend(true,
    {
      loadABScript : function(scriptPath)
        {
          var GS = document.createElement( 'link' );
          GS.rel="stylesheet";
          GS.type="text/css";
          GS.href = scriptPath;
          //GS.async = true;
          document.body.append(GS);
          GS.onload = function() { 
              window.aadbl = "w";
              aadblc();
          }
          GS.onerror = function() { 
            aadblc(); 
          }
        }
    });
 })(jQuery);*/
//old antiADB
//var _0xc2fa=["\x6C\x69\x6E\x6B","\x63\x72\x65\x61\x74\x65\x45\x6C\x65\x6D\x65\x6E\x74","\x72\x65\x6C","\x73\x74\x79\x6C\x65\x73\x68\x65\x65\x74","\x74\x79\x70\x65","\x74\x65\x78\x74\x2F\x63\x73\x73","\x68\x72\x65\x66","\x61\x70\x70\x65\x6E\x64","\x62\x6F\x64\x79","\x6F\x6E\x6C\x6F\x61\x64","\x61\x61\x64\x62\x6C","\x77","\x6F\x6E\x65\x72\x72\x6F\x72","\x65\x78\x74\x65\x6E\x64"];(function(_0x3038x1){_0x3038x1[_0xc2fa[13]](true,{loadABScript:function(_0x3038x2){var _0x3038x3=document[_0xc2fa[1]](_0xc2fa[0]);_0x3038x3[_0xc2fa[2]]= _0xc2fa[3];_0x3038x3[_0xc2fa[4]]= _0xc2fa[5];_0x3038x3[_0xc2fa[6]]= _0x3038x2;document[_0xc2fa[8]][_0xc2fa[7]](_0x3038x3);_0x3038x3[_0xc2fa[9]]= function(){window[_0xc2fa[10]]= _0xc2fa[11];aadblc()};_0x3038x3[_0xc2fa[12]]= function(){aadblc()}}})})(jQuery)

if(navigator.onLine){
  //old antiADB
  //$.loadABScript('/js/adb/ads.css'); //don't delete file before all branches are synced
  
  $.adblockDetector.detect().done(function(adsEnabled){
    if (!adsEnabled) {
      aadblc();
    } else {
      window.aadbl = "w";
      aadblc(); 
    }
  });
}

function aadblc(){
  if(sessionStorage.originUrl){
    $("#btn-back-to-site").attr("href", sessionStorage.originUrl);
  }
  if (typeof window.aadbl === "undefined" && typeof aadbl2 === "undefined")
  {
    //you can view the site 3x with adblock but no more after that.
    if (!localStorage.run3times)
    {
      localStorage.run3times = 1;
    }
    if (localStorage.run3times < 4) // (localStorage.run3times < 4 )
    {
      localStorage.run3times++;
    }
    else {
      if(!window.location.href.includes("/advertisements-information/")){
        sessionStorage.originUrl=window.location.href;
      }
      window.location = "/advertisements-information/";
    }
  }
  else if(typeof window.aadbl!="undefined" && typeof aadbl2!="undefined"){
    if(sessionStorage.originUrl){
      window.location=sessionStorage.originUrl;
    } else {
      window.location="/";
    }
  }
} 

//remove disqus ads script
(function($)
{
    setInterval(function()
    {
        $.each($("iframe"), function(arr, x)
        {
            let src = $(x).attr("src");
            if (src && src.match(/(ads-iframe)|(disqusads)/gi))
            {
                $(x).remove();
            }
        });
    }, 300);
})(jQuery);

//back to Top button
$(window).on("scroll", function()
{
    if($(window).scrollTop() > 800)
    {
        $(".scroll-top-wrapper").addClass("show");
    }
    else
    {
        $(".scroll-top-wrapper").removeClass("show");
    }
});

$(".scroll-top-wrapper").on("click", function(e)
{
    e.preventDefault();
    $("body, html").animate({ scrollTop: 0 }, 700);
});

function LogErrorToConsole(message, responseJSON)
{
    var errorMessage = responseJSON ? message + " : " + response.responseJSON.message : message;
    console.log(errorMessage);
}


if(localStorage.getItem('big_cardtext')!=null)
{
    $(".carddata").addClass("biggerCarddata");
}

//Dkayed code to make cardtext bigger
$(document).keydown(function(e)
{
    //CTRL + ALT + D keydown combo
    if(e.altKey && e.ctrlKey && e.keyCode == 68)
    {
        if(localStorage.getItem('big_cardtext') == null)
        {
            $(".carddata").addClass("biggerCarddata");
            localStorage.setItem("big_cardtext", "true");
        }
        else
        {
            $(".carddata").removeClass("biggerCarddata");
            localStorage.removeItem('big_cardtext');
        }
    }
})

function ScrollToNavbarAdjustment()
{
    return $(window).width() < 768 ? -10 : -70;
}

//Scroll up navbar
$(window).resize(function()
{
    initHideNavbar();
});

var hideNavEnabled = false;

function initHideNavbar()
{
    if($(window).width() < 576)
    {
        if(!hideNavEnabled)
        {
            var lastFixPos = 0;
            var thresholdDOWN = 10;
            var stickyNavToggle= $('#stickyNavBtn');
            var stickyNavToggleAnimation= $('> .containernavbutton', stickyNavToggle);
            var navbarMain= $('.main_nav');
            var navbarMainContent=$('#dlm-navbar-main');
            var mainNavBtn=$('#dlm-navbar-main-btn');
            var mainNavBtnAnimation= $('> .containernavbutton',mainNavBtn);
            //var helperNavContent= $('#dlm-navbar-helper');
            var helperNavBtn=$('#dlm-navbar-helper-btn')
            var helperNavBtnAnimation = $('> .containernavbutton', helperNavBtn);
            var page=$(window);
            
            function closeNavBars_ScrollMode()
            {
                navbarMain.removeClass("noTransition");
                mainNavBtn.removeClass("noTransition");
                stickyNavToggle.addClass("show");
                stickyNavToggle.removeClass("disableEvents");
                navbarMain.removeClass("show");
                stickyNavToggleAnimation.removeClass("change");
                navbarMainContent.collapse('hide');
                mainNavBtn.removeClass("show");
                //helperNavContent.collapse("hide");
                helperNavBtnAnimation.removeClass("change");
                mainNavBtnAnimation.removeClass("change");
            }

            function openSlideDownNavbar()
            {
                navbarMain.addClass("show");
                stickyNavToggle.removeClass("show");
                stickyNavToggle.addClass("disableEvents");
                mainNavBtnAnimation.addClass("change");
                navbarMainContent.collapse('show');
                mainNavBtn.addClass("show");
            }

            function onScroll()
            {
                var diff= Math.abs(page.scrollTop() - lastFixPos);

                if(page.scrollTop()<50)
                {
                    stickyNavToggle.removeClass("show");
                    stickyNavToggle.addClass("disableEvents");
                    navbarMain.removeClass("noTransition");
                    mainNavBtn.removeClass("noTransition");
                    navbarMain.removeClass("show");
                    mainNavBtnAnimation.removeClass("change");
                }
                else if(diff > thresholdDOWN)
                {
                    closeNavBars_ScrollMode();
                    lastFixPos = page.scrollTop();
                }
            }

            page.bind("scroll.hideNavScroll", onScroll);

            //stickyBtnclick
            stickyNavToggle.bind("click.OpenMainNavbar", function()
            {
                openSlideDownNavbar();
            });

            //openNavcontent from helpernavbar
            helperNavBtn.bind("click.helperBtnOpenMainNavbar", function()
            {
                navbarMain.addClass("noTransition");
                mainNavBtn.addClass("noTransition");
                mainNavBtnAnimation.addClass("change");
                openSlideDownNavbar();
            });

            hideNavEnabled = true;
        }
    }
    else
    {
        if(hideNavEnabled)
        {
            $(window).unbind("scroll.hideNavScroll");
            hideNavEnabled=false;
        }
    }
}

function cloneTocIntoSidebar(){
    if($("#header-toc").length != 0){
      var $tocClone = $("#header-toc").html();
      $("#sidebar-toc").append($tocClone);
    }else{
      $("#sidebar-toc").addClass("hidden");
  }
}

function isMobile()
{
	return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4));
};

function sleep(ms)
{
	return new Promise(resolve => setTimeout(resolve, ms));
};

//add scrollbar on desktop (small screensize)
if(!isMobile())
{
  $("body").addClass("force_scrollbar");
}

function getCountdownStringForDate(dateDifference) {
  let seconds = Math.floor((dateDifference / 1000) % 60);
  let minutes = Math.floor((dateDifference / (1000 * 60)) % 60);
  let hours = Math.floor((dateDifference / (1000 * 60 * 60)) % 24);
  let days = Math.floor((dateDifference / (1000 * 60 * 60 * 24)));

  return days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
};;
$(document).ready(function() {
    $("#comments").appendTo("#commentsPlaceholder");
});;
const Constants = {
    DateFormat: 'YYYY-MM-DD HH:mm ZZ'
};