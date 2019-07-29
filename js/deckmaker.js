// Global variables
// =================
var currentDeckArray;
var currentForbiddenList;
var qtipOptions;
var skillPopupData;

// Main function
// =================
$(function()
{
    updatePopupsForDesktops();
    getForbiddenList();
});

//close qtips on scroll
$(window).scroll(function()
{
    $('div.qtip:visible').qtip('hide');
});

function obtainSkillInformation(instance, current)
{
    // Obtain the skill
    var skill = $(current.opts.$orig).html();

    // Obtain the skill data
    new CardsAPI().searchSkill(skill, displaySkillInformation);
};

function displaySkillInformation(skill)
{
    if(skill)
    {
        $('#skillTitle').html(skill.name);
        $('#skillDescription').html(skill.description);
        var exclusiveString = (skill.exclusive == true ? 'Skill exclusive to ' + skill.characters[0].name : 'Skill can be used by different characters.');
        $('#skillExclusive').html(exclusiveString);

        var first_column = true;
        $('#skillObtain').find('#first_column').empty();
        $('#skillObtain').find('#second_column').empty();
        $(skill.characters).each(function(index, character)
        {
            if(first_column)
            {
                $('#skillObtain').find('#first_column').append('<p>' + character.name + ' by ' + character.how + ' Reward' + '</p>');
            }
            else
            {
                $('#skillObtain').find('#second_column').append('<p>' + character.name + ' by ' + character.how + ' Reward' + '</p>');
            }
            first_column = !first_column;
        });

        $('#characterImage').one("load", function()
        {
            resizeSkillInformation();
        });
        $('#characterImage').attr('src', skill.imageURL);
    }
};

function resizeSkillInformation()
{
    // Style the image for large skill descriptions
    var containerHeight = $('#characterImageContainer').height();
    var difference = Math.floor(containerHeight - 146); // Default height of all pics are 146
    $('#characterImage').css('padding-top', Math.floor(difference / 2) + 'px');
};

function updatePopupsForDesktops()
{
    let options = {
        overwrite: false,
        style:
        {
            classes: 'qtip-dark qtip-shadow rounded'
        },
        show:
        {
            effect: function()
            {
                $(this).fadeIn(175);
            },
            solo: true,
            delay: 0,
            ready: true
        },
        hide:
        {
            //fixed: true, 
            effect: function()
            {
                $(this).fadeOut(60);
            },
        },
        position:
        {
            my: "left center",
            at: "center right",
            viewport: $(window),
            effect: false,
            adjust:
            {
                method: 'flip shift'
            }
        },
        events:
        {
            hidden: async function(event, api)
            {
                // Destroy it after hide
                api.destroy(true);
            }
        },
        content:
        {
            text: obtainTextForDesktops
        }
    }
    //below 520 to mobile hover
    if(($(window).width() < 520 || $(window).height() < 640) && isMobile())
    {
        options.position.my = "center center";
        options.position.at = "center center";
        options.position.adjust.method = "none none";
        options.position.adjust.resize = false;
        options.position.adjust.scroll = false;
        options.position.target = $(window);
        options.style.classes = 'qtip-dark qtip-shadow rounded mobileQtip';
        //below 1070px show hover below and shift to the left/right
    }
    else if($(window).width() < 1070)
    {
        options.position.my = "top center";
        options.position.at = "bottom center";
        options.position.adjust.method = "shift flip";
    }
    // Manually show/hide the popup, as the listener for qtip
    // doesn't add the card/skill listeners correctly outside a deck (EDIT: dont know if this is true anymore)
    if(isMobile())
    {
        $('body').on("click", ".dcards[name*=\"skillPopup\"]", function(event){
            options.position.adjust.y = (window.innerHeight - $(window).height()) / 2;
            openQTip(this, event);
        });

        $('body').on("click", ".dcards[name*=\"cardPopup\"]", function(event){
            options.position.adjust.y = (window.innerHeight - $(window).height()) / 2;
            openQTip(this, event);
        });
        $('body').on("click", ".card-hover", function(event) {
            options.position.adjust.y=(window.innerHeight-$(window).height())/2;
            openQTip(this, event);
        });
    }
    else
    {
        var openEvent = "mouseover";
        $('.dcards[name*="cardPopup"]').off(openEvent).on(openEvent, function(event)
        {
            openQTip(this, event);
        });
        $('body').off(openEvent).on(openEvent, '.card-hover', function(event)
        {
            openQTip(this, event);
        });
    }
    async function openQTip(element, event)
    {
        options.show.event = event.type;
        $(element).qtip(options, event);
    }
    qtipOptions = options;
};

// Used in deck-review.js
function displayDeckPopupForDesktops(deckArray, deckElement, eventType)
{
    currentDeckArray = deckArray;
    qtipOptions.show.event = eventType;
    if(deckElement != null)
    {
        $(deckElement).qtip(qtipOptions, event);
    }
};

function obtainTextForDesktops(event, api)
{
    const type = $(this).attr('name');

    if(type == "cardPopup")
    {
        let name = (this).attr('encName');
        let nameDecoded = decodeURIComponent(name);

        new CardsAPI().search(nameDecoded, displayTextForCardsOnDesktops(api));
        return "Loading card...";
    }
    else if(type == "skillPopup")
    {
        skillPopupData = null;

        const skill = $(this).data("skill") != undefined ? $(this).data("skill") : $(this).html();
        new CardsAPI().searchSkill(skill, displayTextForSkillOnDesktops(api));

        skillPopupData ? skillPopupData : "Loading skill...";
        return skillPopupData;
    }

    if(currentDeckArray != null && currentDeckArray.length > 0)
    {
        return displayDeckOnDesktops();
    }
};

function displayDeckOnDesktops()
{
    var clone = $('#desktopPopupForDecks').clone();
    if(currentDeckArray != null && currentDeckArray.length > 0)
    {
        $.each(currentDeckArray, function(index, card)
        {
            var url = '<div class="item">'

            var cardName = card;
            var foilType = '';
            if(cardName.includes('$'))
            {
                foilType = cardName.substring(cardName.length - 1);
                var index = cardName.indexOf('$');
                cardName = cardName.substring(0, index);
            }

            $.each(currentForbiddenList, function(index, section)
            {
                var notFound = true;
                $.each(section.cards, function(index, sectionCard)
                {
                    if(cardName == sectionCard.name)
                    {
                        if(section.section == "Limited")
                        {
                            url = url + '<img class="card-fl" src="/img/assets/limited.png">';
                        }
                        else
                        {
                            url = url + '<img class="card-fl" src="/img/assets/semi.png">';
                        }
                        notFound = false;
                        return false;
                    }
                });
                return notFound;
            });

            if(foilType == 'G')
            {
                url = url + '<span class="fa-stack fa-1x foil-icon foil-icon-deck-preview"><i class="far fa-circle fa-stack-2x foil-icon-circle"></i><i class="fas fa-circle fa-stack-1x foil-icon-whole-circle"></i><strong class="fa-stack-1x foil-icon-text-right-preview foil-icon-text-card">G</strong></span>';
            }
            if(foilType == 'P')
            {
                url = url + '<span class="fa-stack fa-1x foil-icon foil-icon-deck-preview"><i class="far fa-circle fa-stack-2x foil-icon-circle"></i><i class="fas fa-circle fa-stack-1x foil-icon-whole-circle"></i><strong class="fa-stack-1x foil-icon-text-left-preview foil-icon-text-card">P</strong></span>';
            }

            url = url + '<a><img class="dcards" src="' + (new CardsAPI().getImageURL(cardName)) + '"></a></div>';
            clone.find('#cards').append(url);
        });

        // api.set('content.text', clone.show()[0]);
        return clone.show()[0];
    }
};

function displayTextForCardsOnDesktops(api)
{
    return function(card)
    {
        var clone = $('#desktopPopup').clone();

        //RARITY
        if(card.rarity.length > 0)
        {
            clone.find('#cardDesktopRarity').attr('src', getWebsiteLink() + '/img/assets/' + card.rarity + '.png');
            clone.find('#cardDesktopRarity').show();
        }
        else
        {
            clone.find('#cardDesktopRarity').hide();
        }

        //IMAGE
        clone.find('#cardDesktopImage').attr('src', new CardsAPI().getImageURL(card.name));

        //NAME
        clone.find('#cardName').html(card.name);

        //ATTRIBUTE
        if(card.attribute.length > 0)
        {
            clone.find('#cardAttribute').text('Attribute: ' + card.attribute + " ");
            clone.find('#cardAttribute').show();
        }
        else
        {
            clone.find('#cardAttribute').hide();
            clone.find('#attrLevelContainer').hide();
        }

        //LEVEL
        if(card.isLinkMonster)
        {
            clone.find('#cardLevel').hide();
        }
        else if(card.isXyzMonster)
        {
            clone.find('#cardLevel').text('| Rank: ' + card.level);
            clone.find('#cardLevel').show();
        }
        else if(card.level.toString(10).length > 0)
        {
            clone.find('#cardLevel').text('| Level: ' + card.level);
            clone.find('#cardLevel').show();
        }
        else
        {
            clone.find('#cardLevel').hide();
        }

        //MATERIAL
        if(card.materials.length > 0)
        {
            clone.find('#cardMaterials').html('<i>' + card.materials + '</i>');
            clone.find('#cardMaterials').show();
        }
        else
        {
            clone.find('#cardMaterials').hide();
        }
        clone.find('#cardText').html(card.description);
        clone.find('#cardType').html('<b>[ </b><span class="caps">' + card.type + '</span><b> ]</b>');

        //STATS
        if(card.isLinkMonster)
        {
            //Links don't have defense.
            clone.find('#cardAttackDefense').html("<b>ATK/ </b>" + card.attack);
        }
        else if(card.attack.toString(10).length > 0)
        {
            clone.find('#cardAttackDefense').html("<b>ATK/ </b>" + card.attack + " " + "<b>DEF/ </b>" + card.defense);
        }
        else
        {
            clone.find('#cardAttackDefense').hide();
        }
        $(card.obtain).each(function(index, how)
        {
            clone.find('#cardObtain').append('<p class="caps">' + how + '</p>');
        });

        api.set('content.text', clone.show()[0]);

        //resize font/maxheight if needed
        if(($(window).width() < 520 || $(window).height() < 640) && isMobile())
        {
            var qtipSelector = "#qtip-" + api.get('id');
            $(qtipSelector).css("max-height", window.innerHeight);
            resizeFontNoOverflow(qtipSelector);
        }
    };
};

function resizeFontNoOverflow(qtipSelector)
{
    var qtip = $(qtipSelector);
    if(qtip.length < 0)
    {
        return;
    }
    var maxTrys = 200;
    var carddata = $(qtip).find(".carddata");
    while(qtip.prop('scrollWidth') > qtip.prop('offsetWidth') || qtip.prop('scrollHeight') > qtip.prop('offsetHeight'))
    {
        var fontSizeNumber = (parseFloat($(carddata).css('font-size').slice(0, -2)) * 0.975)
        //min Fontsize 5px
        if(fontSizeNumber < 5 || maxTrys <= 0)
        {
            break;
        }
        var newFontStr = fontSizeNumber + 'px';
        $(carddata).css('font-size', newFontStr);
        maxTrys = maxTrys - 1;
    }
}


function displayTextForSkillOnDesktops(api)
{
    return function(skill)
    {
        if(!skill)
        {
            api.destroy(true);
            return;
        }
        
        var clone = $('#desktopPopupForSkills').clone();

        clone.find('#skillName').html(skill.name);
        clone.find('#skillDescription').html(skill.description);

        var exclusiveString = (skill.exclusive == true ? 'Skill exclusive to ' + skill.characters[0].name : 'Skill can be used by different characters.');
        clone.find('#skillExclusive').html(exclusiveString);

        clone.find('#previewSkillImage').attr('src', skill.imageURL);

        var first_column = true;
        $(skill.characters).each(function(index, character)
        {
            if(first_column)
            {
                clone.find('#skillObtain').find('#first_column').append('<p>' + character.name + ' by ' + character.how + ' Reward' + '</p>');
            }
            else
            {
                clone.find('#skillObtain').find('#second_column').append('<p>' + character.name + ' by ' + character.how + ' Reward' + '</p>');
            }
            first_column = !first_column;
        });

        skillPopupData = clone.show()[0];
        api.set('content.text', skillPopupData);
    }
};

function getForbiddenList()
{
    $.getJSON("/data/forbiddenList.json", function(data)
    {
        currentForbiddenList = data;
    });
};;