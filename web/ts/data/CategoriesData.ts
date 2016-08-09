"use strict";
import {Answer} from "../model/Answer";
import {Question} from "../model/Question";
import {Category} from "../model/Category";

export const CategoriesData = {
    "love": new Category("love", {
            1: new Question("How hairy?", {
                    A: new Answer("Kiwi Fuzz"),
                    B: new Answer("Gorilla Power"),
                    C: new Answer("Beluga"),
                    D: new Answer("Corduroy Pants"),
                }
            ),
            2: new Question("The choice is yours", {
                    A: new Answer("Marvel"),
                    B: new Answer("Muppets"),
                }
            ),
            3: new Question("Vegetable Soulmate", {
                    A: new Answer("Broccoli"),
                    B: new Answer("Pumpkin"),
                    C: new Answer("Aubergine"),
                    D: new Answer("Radish"),
                }
            ),
        }
    ),
    "prosperity": new Category("prosperity", {
            1: new Question("How does your garden grow?", {
                    A: new Answer("Fibre Optic"),
                    B: new Answer("Faery Power"),
                    C: new Answer("Tesla"),
                    D: new Answer("Banana Slug"),
                }
            ),
            2: new Question("The choice is yours", {
                    A: new Answer("Salad"),
                    B: new Answer("Stew"),
                }
            ),
            3: new Question("Flora Soulmate", {
                    A: new Answer("Flowering Cacti"),
                    B: new Answer("Heather"),
                    C: new Answer("Yew"),
                    D: new Answer("Twisted Hazel"),
                }
            ),
        }
    ),
    "body & mind": new Category("body & mind", {
            1: new Question("How fruity?", {
                    A: new Answer("Pineapple"),
                    B: new Answer("Pomegranate"),
                    C: new Answer("Conference Pear"),
                    D: new Answer("Caramel Yoghurt"),
                }
            ),
            2: new Question("The choice is yours", {
                    A: new Answer("Pokémon"),
                    B: new Answer("Pocahontas"),
                }
            ),
            3: new Question("Musical Soulmate", {
                    A: new Answer("Bongo Natty"),
                    B: new Answer("Uptown Funkster"),
                    C: new Answer("I'm a little teapot"),
                    D: new Answer("Sound of Silence"),
                }
            ),
        }
    ),
    "mystery": new Category("mystery", {
            1: new Question("How fit are you?", {
                    A: new Answer("Marathon Minion"),
                    B: new Answer("Yoga Bear"),
                    C: new Answer("Veggie Wedgie"),
                    D: new Answer("Boppin' Baloo"),
                }
            ),
            2: new Question("The choice is yours", {
                    A: new Answer("Inside"),
                    B: new Answer("Outside"),
                }
            ),
            3: new Question("Magical Wedding Soulmates", {
                    A: new Answer("Yoshi & Yello"),
                    B: new Answer("Hannah & Adam"),
                    C: new Answer("Gimme a Fivesome"),
                    D: new Answer("Custardasaur & MerMan"),
                }
            ),
        }
    ),
};