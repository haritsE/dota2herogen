import _ from 'underscore';

const services = {
    getRandomHero: (heroes, options = {}) => {
        const attackType = {
            DOTA_UNIT_CAP_MELEE_ATTACK: 'melee',
            DOTA_UNIT_CAP_RANGED_ATTACK: 'ranged',
        };

        const attrType = {
            DOTA_ATTRIBUTE_INTELLECT: 'intelligence',
            DOTA_ATTRIBUTE_AGILITY: 'agility',
            DOTA_ATTRIBUTE_STRENGTH: 'strength',
        };

        const excludedHeroes = options.excludedHeroes || [];
        const includedAttackType = options.includedAttackType || [];
        const includedAttrType = options.includedAttrType || [];

        const usedHeroes = Object.assign({}, heroes);

        excludedHeroes.forEach(key => {
            delete usedHeroes[key];
        });

        var usedAttackHeroes = {};
        if (includedAttackType.length > 0) {
            for (var key in usedHeroes) {
                const hero = usedHeroes[key];
                if (includedAttackType.includes(attackType[hero.attacktype])) {
                    usedAttackHeroes[key] = hero;
                }
            }
        } else {
            usedAttackHeroes = usedHeroes;
        }

        var usedAttackAttrHeroes = [];
        if (includedAttrType.length > 0) {
            for (var key in usedAttackHeroes) {
                const hero = usedAttackHeroes[key];
                if (includedAttrType.includes(attrType[hero.attributeprimary])) {
                    usedAttackAttrHeroes[key] = hero;
                }
            }
        } else {
            usedAttackAttrHeroes = usedAttackHeroes;
        }

        const heroKey = _.shuffle(Object.keys(usedAttackAttrHeroes))[0];
        const heroCode = heroKey.split('npc_dota_hero_')[1];
        const heroImage = `http://cdn.dota2.com/apps/dota2/images/heroes/${heroCode}_lg.png`;
        const hero = usedAttackAttrHeroes[heroKey];
        return Object.assign({}, hero, {
            image: heroImage,
            code: heroCode,
            key: heroKey,
        });
    }
}

export default services;